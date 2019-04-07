const compose = require('./koa-compose');

const middleware = [
  (ctx, next) => {
    console.log('1');
    return next();
  },
  (ctx, next) => {
    console.log('2');
    return next();
  },
  (ctx, next) => {
    console.log('3');
    return next();
  },
];

const com = compose(middleware);

com('ctx', () => {
  console.log('hey');
})
.then(() => {
  console.log('end');
})
