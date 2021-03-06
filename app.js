const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const Pug = require('koa-pug');
const staticServer = require('koa-static');
const moment = require('moment');
const path = require('path');
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const session = require('koa-session');
const MongooseStore = require('koa-session-mongoose');

const app = new Koa();
app.keys = ['secret'];
const pug = new Pug({
    viewPath: 'app/views/pages',
    app
});

mongoose.connect('mongodb://localhost:4000/movie');

app.listen(port);

const router = new Router();
require('./config/routes')(router, app);

app.use(session({
    key: 'JSESSIONID',
    store: new MongooseStore({
        collection: 'sessions',
        name: 'Session',
        expires: 7200
    })
}, app));
app.use(async (ctx, next) => {
    ctx.state.moment = moment;
    let _user = ctx.session.user;
    if(_user) {
        ctx.state.user = _user;
    }
    await next();
});
app.use(koaBody({multipart: true}));
app.use(staticServer(path.join(__dirname,'public')));
app.use(router.routes());

console.info('Server started port 3000');