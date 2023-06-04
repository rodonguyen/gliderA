# Glider Platform API

The fast, stable and reliable [Glider Platform REST API](https://github.com/rodonguyen/gliderA).   
Response time for frequently used pages is usually under 2 seconds.

Technologies used:
- Express
- [Redis](https://github.com/redis/node-redis#installation)

## Getting started

`npm i`  
`npm start`  
Then the app should be running at [http://localhost:3030](http://localhost:3030).  
Try your first request [http://localhost:3030/v1/accounts?page=28&size=50](http://localhost:3030/v1/accounts?page=28&size=50).  
Change the number of `page` and `size (optional)` to your need.

## Future improvements
- Parallelly retrieve account data for multiple pages for faster response time. Done (using `Promise.all()`).
- Data stored in Redis should have Time-To-Live if data change in the future.
- Move the initialisation to app.js and reuse it instead. `redisClient` initialisation in [routes/v1/accounts.js](routes/v1/accounts.js) may be slow and thus increase response time.
- Use [Redis-ObjectMapping](https://github.com/redis/redis-om-node) instead of [Redis](https://github.com/redis/node-redis) for easier data handling(?): reducing the effort of parsing String to JSON and preparing for growing `account` data complexity.
