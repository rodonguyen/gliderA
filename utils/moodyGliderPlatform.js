const axios = require("axios");

async function requestAccountsInAPage(pageNumber) {
    const response = await axios.get(`https://moody.gliderplatform.com/page/${pageNumber}`)
                        .then(response => {
                            // console.log('requestAccountsInAPage response.data page', pageNumber, response.data);
                            return response.data.message
                        })
                        .catch(error => {
                            if (error.response && error.response.status === 500) {
                                return requestAccountsInAPage(pageNumber)
                            }
                            // console.error(error);
                        });

    // console.log('requestAccountsInAPage final response', pageNumber, response)
    return response
}

function checkPageIsFull(response) {
    console.log(response)
    for (let key in response) {
        // console.log(key, response[key], response[key].account_number)
        if (!response[key].account_number) {
            console.log('checkPageIsFull returns false')
            return false
        }
    }
    return true

}

const getAccounts = async (pageStart, pageEnd) =>  {

    const result = {}

    for (let page = pageStart; page <= pageEnd; page++) {
        let queriedAccounts = false, isFull = false

        while (!isFull) {
            queriedAccounts = await requestAccountsInAPage(page)
            // console.log('queriedAccounts', queriedAccounts)
            isFull = checkPageIsFull(queriedAccounts)
        }
        
        // console.log('queriedAccounts, page', page, queriedAccounts)
        queriedAccounts.forEach((_, index) => {
            // console.log(page*10+index)
            result[page*10+index] = queriedAccounts[index]
        })
    }

    // console.log('result', result)
    return result
}

module.exports = {
    getAccounts
  };
  