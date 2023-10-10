const Router = require('@koa/router');
const userRouter = require('./user');
const projectRouter = require('./project');

const { apiVersion } = require('../../package.json');

const router = new Router({ prefix: `/${apiVersion}`});

router
    .use(userRouter.routes())
    .use(projectRouter.routes())

module.exports = router;