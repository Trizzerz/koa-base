const Router = require('@koa/router');
const userRouter = require('./user');
const projectRouter = require('./project');

const router = new Router();

router
    .use(userRouter.routes())
    .use(projectRouter.routes())

module.exports = router;