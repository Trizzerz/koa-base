const Koa = require('koa');
const { bodyParser } = require("@koa/bodyparser");
const ratelimit = require('koa-ratelimit');
const { LRUCache } = require('lru-cache')
const koaCash = require('koa-cash');

const router = require('./router');

const cache = new LRUCache({
    max: 500,

    // for use with tracking overall storage size
    maxSize: 5000,
    sizeCalculation: (value, key) => {
        return 1
    },

    // for use when you need to clean up something when objects
    // are evicted from the cache
    dispose: (value, key) => {
        freeFromMemoryOrWhatever(value)
    },

    // how long to live in ms
    ttl: 1000 * 60 * 5,

    // return stale items before removing from cache?
    allowStale: false,

    updateAgeOnGet: false,
    updateAgeOnHas: false,

    // async method to use for cache.fetch(), for
    // stale-while-revalidate type of behavior
    fetchMethod: async (
        key,
        staleValue,
        { options, signal, context }
    ) => { },
});

const app = new Koa();
app
    // .use(ratelimit({
    //     driver: 'redis',
    //     db: new Redis(),
    //     duration: 60000,
    //     errorMessage: 'Sometimes You Just Have to Slow Down.',
    //     id: (ctx) => ctx.ip,
    //     headers: {
    //         remaining: 'Rate-Limit-Remaining',
    //         reset: 'Rate-Limit-Reset',
    //         total: 'Rate-Limit-Total'
    //     },
    //     max: 100,
    //     disableHeader: false,
    //     whitelist: (ctx) => {
    //         // some logic that returns a boolean
    //     },
    //     blacklist: (ctx) => {
    //         // some logic that returns a boolean
    //     }
    // }))
    .use(koaCash({
        get: (key) => {
            return cache.get(key);
        },
        set(key, value) {
            return cache.set(key, value);
        },
    }))
    .use(async (ctx, next) => {
        // this response is already cashed if `true` is returned,
        // so this middleware will automatically serve this response from cache
        if (await ctx.cashed()) return;
        await next();
    })
    .use(bodyParser())
    .use(router.routes())

app.listen(443);