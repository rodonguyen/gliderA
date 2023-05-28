const express = require('express');
const router = express.Router();
const moodyGliderPlatform = require('../../utils/moodyGliderPlatform')
require("dotenv").config();



/* GET users listing. */
router.get('/', async function(req, res) {
  // res.status(200).json({message: 'This is /account endpoint.'})
  const defaultSize = 10;
  
  // Retrieve the page and size parameters from the query string
  const page = req.query.page
  const size = req.query.size || defaultSize
  // Calculate necessary values
  const startAccountNumber  = (page - 1) * size + 1
  const endAccountNumber    = page * size
  const realStartPageNumber = Math.floor((startAccountNumber / 10))    // real is used on moodyGliderPlatform
  const realEndPageNumber   = Math.floor((endAccountNumber / 10))      // real is used on moodyGliderPlatform

  // Do something with the retrieved parameters
  console.log(`Query: Page ${page}, Size ${size}`);

  // Handle missing `page` value
  if (!page) {
    res.status(200).json({
      queryParams: {page: page, size: size}, 
      message: 'Missing `page` parameter. Your URL should look like this: http://localhost:3030/v1/accounts?page=7&size=8'})
    return 
  }

  // Check if `page` and `size` values are accepted (too large)
  const existLastRealPage = await moodyGliderPlatform.requestAccountsInAPage(realEndPageNumber)
  if (! existLastRealPage) {
    res.status(200).json({
      queryParams: {page: page, size: size}, 
      message: 'Page and size number is too large. Thus, the last account is not found in the database.'})
    return
  }

  // Check Redis if it has all the accounts from [(page-1)*size + 1, page*size] inclusive
  // Query Redis here
  // ...

  // If Yes, return the result
  if (false) {
    res.status(200).json(result)
    return
  }

  // Example: 3,22 -> 44->66

  // Find all the account numbers missing from Redis

  // const missingAccountPagesAndNumbers = {}

  // for (let realPage = realStartPageNumber; realPage <= realEndPageNumber; realPage++) {
  //   if (missingAccountPagesAndNumbers[realPage] === undefined) {
  //     missingAccountPagesAndNumbers[realPage] = []
  //   }

  //   for (let accountNumber = startAccountNumber; accountNumber < (realPage+1)*10; accountNumber++) {
  //     missingAccountPagesAndNumbers[realPage].push(accountNumber)
  //   }
  // }
  // console.log(missingAccountPagesAndNumbers)



  // const accounts = {}
  // for (let i = startAccountNumber; i <= endAccountNumber; i++) {
  //   accounts[i] = null
  // }
  // console.log(accounts)

  
  // If No, request the original API until it has all the required accounts
  // Request each page in parallel if possible
  const queriedAccounts = await moodyGliderPlatform.getAccounts(pageStart = realStartPageNumber, pageEnd = realEndPageNumber)
  // Slice and get only required accounts
  const requiredAccounts = {}
  for (let i = startAccountNumber; i <= endAccountNumber; i++) {
    requiredAccounts[i] = queriedAccounts[i]
  }

  
  // Add pages to Redis if they haven't been done so 
  // ...

  // Return the result
  res.status(200).json({
    queryParams: {page: page, size: size}, 
    message: requiredAccounts
  })  
})























// async function requestAccountsInAPage(pageNumber) {
//   const response = await axios.get(`https://moody.gliderplatform.com/page/${pageNumber}`)
//                       .then(response => {
//                           console.log(response.data);
//                           return response.data
//                       })
//                       .catch(error => {
//                           console.error(error);
//                       });
  

//   return response.message
// }

// function checkPageIsFull(response) {
//   // {"message":"Internal Server Error"} statusCode 500
//   if (! Array.isArray(queriedAccounts)) 
//       return false

//   for (let item in response) {
//       if (item.account_number === undefined) {
//           return false
//       }
//   }
//   return true

// }

// const getAccounts = async (pageStart, pageEnd) =>  {

//   const result = {}

//   for (let page = pageStart; page <= pageEnd; page++) {
//       let queriedAccounts = false, isFull = false

//       while (isFull) {
//           queriedAccounts = requestAccountsInAPage(pageNumber)
//           isFull = checkPageIsFull(queriedAccounts)
//       }
      
//       queriedAccounts.forEach((accountNumber, index) => {
//           result[pageStart+index] = queriedAccounts[index]
//       })
//   }

//   console.log(result)
//   return result
// }






module.exports = router;
