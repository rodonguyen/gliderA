const express = require("express");
const router = express.Router();
const { createClient } = require("redis");
const moodyGliderPlatform = require("../../utils/moodyGliderPlatform");

require("dotenv").config();

/* GET account info. */
router.get("/", async function (req, res) {
  
  // Retrieve the page and size parameters from the query string
    const defaultSize = 10;
    const page = req.query.page;
    const size = req.query.size || defaultSize;

    // Calculate necessary values
    const startAccountNumber = (page - 1) * size + 1;
    const endAccountNumber = page * size;
    const realStartPageNumber = Math.ceil(startAccountNumber / 10); // real is used on moodyGliderPlatform
    const realEndPageNumber = Math.ceil(endAccountNumber / 10);     // real is used on moodyGliderPlatform

    // Handle missing `page` value
    if (!page || page <= 0) {
        res.status(200).json({
            queryParams: { page: page, size: size },
            message:
                "The `page` parameter must be included and >= 1. Your URL should look like this: http://localhost:3030/v1/accounts?page=1&size=25",
        });
        return;
    }

    // Check if `page` and `size` values are accepted (too large or negative)
    // console.log(realEndPageNumber)
    const existLastRealPage = await moodyGliderPlatform.requestAccountsInAPage(
        realEndPageNumber
    );
    if (!existLastRealPage) {
        res.status(200).json({
            queryParams: { page: page, size: size },
            message:
                "Page and size number is too large. Thus, the last account is not found in the database.",
        });
        return;
    }

    // Retrieve account data page by page
    //    Check Redis first
    //    If not exist on Redis,
    //        Request directly from moodyGliderPlatform and
    //        Bbackup in Redis
    const allQueriedAccount = {};
    const redisClient = createClient({ url: process.env.REDIS_URL });
    await redisClient.connect();

    // TODO: Parallelize this for loop
    for (let page = realStartPageNumber; page <= realEndPageNumber; page++) {
        let queriedAccounts = false,
            isFull = false,
            isAvailableInRedis = false
        
        // Check Redis first
        queriedAccounts = await redisClient
            .get(page.toString())
            .then((res) => JSON.parse(res))
        
        if (queriedAccounts) {
            console.log(`Retrieved page ${page} from Redis.`)
            isFull = true;
            isAvailableInRedis = true;
        }

        // Not exist on Redis, request directly from moodyGliderPlatform
        while (!isFull) {
            queriedAccounts = await moodyGliderPlatform.requestAccountsInAPage(
                page
            );
            isFull = moodyGliderPlatform.checkPageIsFull(queriedAccounts);
        }

        if (!isAvailableInRedis) {
            // Backup in Redis
            console.log(`Backup page ${page} in Redis`);
            redisClient.set(
                page.toString(),
                JSON.stringify(queriedAccounts)
            );
        }

        // Add newly queried data of this `page` to final result
        queriedAccounts.forEach((_, index) => {
            allQueriedAccount[(page - 1) * 10 + index + 1] =
                queriedAccounts[index];
        });
    }
    redisClient.quit();

    // Slice and get only required accounts
    const requiredAccounts = {};
    for (let i = startAccountNumber; i <= endAccountNumber; i++) {
        requiredAccounts[i] = allQueriedAccount[i];
    }

    // Return the result
    res.status(200).json({
        queryParams: { page: page, size: size },
        message: requiredAccounts,
    });
});


module.exports = router;
