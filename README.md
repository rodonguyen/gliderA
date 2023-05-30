# Glider Platform API

The fast, stable and reliable [Glider Platform REST API](https://github.com/rodonguyen/gliderA). 
Response time for frequent pages is usually under 2 seconds.

Technologies used:
- Express
- [Redis](https://github.com/redis/node-redis#installation)

## Getting started

`npm i`  
`npm start`  
Then the app should be running at [http://localhost:3030](http://localhost:3030)


## Future improvements
- Parallelly retrieve account data for multiple pages
- Data stored in Redis should have Time-To-Live if data change in the future
- Slow redisClient's initialisation. Will move the initialisation to app.js and reuse it instead. 
- Use [Redis-ObjectMapping](https://github.com/redis/redis-om-node) instead of [Redis](https://github.com/redis/node-redis) for easier data handling(?): reducing the effort of parsing String to JSON and preparing for growing `account` data complexity
