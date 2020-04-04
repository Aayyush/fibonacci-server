const keys = require('./keys')
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost, 
    port: keys.redisPort,
    retry_strategy: () => 1000
});
const sub = redisClient.duplicate();


// Slow process; helps to simulate the importance of 
// a worker process. 
function fib(index){
    if (index < 2) return 1;
    return fib(index - 1) + fib(index - 2);
}


sub.on('message', (channel, message) => {
    const ret_val = fib(parseInt(message));
    console.log("Value: " + ret_val);
    redisClient.hset('values', message, fib(parseInt(message)))
});
sub.subscribe('insert');