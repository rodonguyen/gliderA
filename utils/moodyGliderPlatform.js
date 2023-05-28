const axios = require("axios");

async function requestAccountsInAPage(pageNumber) {
    const response = await axios.get(`https://moody.gliderplatform.com/page/${pageNumber}`)
                        .then(response => {
                            return response.data.message
                        })
                        .catch(error => {
                            if (error.response && error.response.status === 500) {
                                return requestAccountsInAPage(pageNumber)
                            }
                            // 
                            if (error.response && error.response.status === 400) {
                                return false
                            }
                        });

    // console.log('requestAccountsInAPage final response', pageNumber, response)
    return response
}

function checkPageIsFull(response) {
    // console.log(response)
    for (let key in response) {
        if (!response[key].account_number) {
            // console.log('checkPageIsFull returns false')
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
            isFull = checkPageIsFull(queriedAccounts)
        }
        queriedAccounts.forEach((_, index) => {
            result[page*10+index] = queriedAccounts[index]
        })
    }

    // console.log('result', result)
    return result
}

module.exports = {
    requestAccountsInAPage,
    getAccounts
  };
  