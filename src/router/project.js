const Router = require('@koa/router');

const router = new Router({ prefix: '/project'});

router.get('/', (ctx) => {
    ctx.body = { msg: 'Project' };
});

module.exports = router;