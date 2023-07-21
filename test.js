
// const jsonString = {
//     "first": {
//         "second": "data"
//     }
// }

/**
 * 
 * @param {String} url - URL for the JSON Data
 * @param {String} path - Path for the JSON iteration
 * @returns 
 */
const getCSGOMarketData = async (url, path) => {
    try {
        const response = await fetch(url);
        const jsonData = await response.json();
        console.log(jsonData);
        let value = Object.assign(jsonData);
        path.split(".").forEach(element => {
            value = value[element];
        });
        //console.log(eval("jsonData."+path));
        console.log(value);
    } catch (error) {
        console.log(`Error in trying to get the data:\n${error.message}`);
        return "Error";
    }
};

// const testJson = (path) => {
//     const data = jsonString;
//     console.log(data["first"]["second"]);
// }

// testJson("")
getCSGOMarketData("https://steamcommunity.com/market/priceoverview/?currency=3&appid=730&market_hash_name=Gamma%20Case", "lowest_price")