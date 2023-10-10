const Router = require('@koa/router');

const router = new Router({ prefix: '/user'});

router.get('/', (ctx) => {
    ctx.body = { msg: 'User' };
});

module.exports = router;