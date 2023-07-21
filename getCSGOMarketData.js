
/**
 * A function to return Data for CSGO Market out of a JSON Response by the STEAM API
 * @author JackyDima <jackydimaweeb@gmail.com>
 * @param {string} url - URL for the JSON Data
 * @param {string} path - Path for the JSON iteration in dot Notation
 *                      Example: "first.second.third"
 * @customfunction
 * @returns {string} - Value of field for the JSON-Path
 */
const getCSGOMarketData = async (url, path) => {
    try {
        const response = await fetch(url);
        const jsonData = await response.json();
        // console.log(jsonData);
        if (jsonData != null && jsonData.success === true) {
            let value = Object.assign(jsonData);
            path.split(".").forEach(element => {
                value = value[element];
            });
            //console.log(eval("jsonData."+path)); // abit unsafe way to do it -> Eval can execute code that harms the system
            // console.log(value);
            return value;
        }
        throw new Error(`No Success in receiving the data`);
    } catch (error) {
        throw error;
    }
};
/**
 * Formatter for the Steam Market Prices
 * @param {string} priceText - Is the value of a steam Price: "1,02€", "4,--€" ...
 * @returns {Number} Price Number
 */
const formatPrice = priceText => {
    if (priceText == null) {
        return -1;
    }
    return Number(priceText.replace("--", "00").replace(",",".").slice(0,-1));
};

// const testURL = "https://steamcommunity.com/market/priceoverview/?currency=3&appid=730&market_hash_name=Operation%20Broken%20Fang%20Case";
// getCSGOMarketData(testURL, "lowest_price").then((value) => {
//     console.log(formatPrice(value));
// });

export { getCSGOMarketData, formatPrice };