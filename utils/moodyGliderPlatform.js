const axios = require("axios");

async function requestAccountsInAPage(pageNumber) {
    const response = await axios
        .get(`https://moody.gliderplatform.com/page/${pageNumber}`)
        .then((response) => {
            return response.data.message;
        })
        .catch((error) => {
            // Error 500: "Internal Server Error"
            if (error.response && error.response.status === 500) {
                return requestAccountsInAPage(pageNumber);
            }
            // Error 400: "page number value not accepted"
            if (error.response && error.response.status === 400) {
                return false;
            }
        });
    return response;
}

/**
 * Check if all accounts in `response` is fully returned.
 * @returns `true` if they are fully returned. Otherwise, `false`.
 */
function checkPageIsFull(response) {
    for (let key in response) if (!response[key].account_number) return false;
    return true;
}

module.exports = {
    requestAccountsInAPage,
    checkPageIsFull,
};
