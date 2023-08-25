import { getCSGOMarketData, formatPrice } from './getCSGOMarketData.js';
import getJson from './getJson.js';
import { writeFileSync, unlinkSync, existsSync } from 'fs'


const getConfigGroup = () => {
    for (const arg of process.argv) {
        //console.log(arg)
        if (arg.indexOf("-c=") !== -1) {
            //console.log(arg.split("=")[1])
            return arg.split("=")[1]
        }
    }
}

const steamAPIBaseURL = "https://steamcommunity.com/market/priceoverview/?currency=3&appid=730&market_hash_name="

const group = getConfigGroup() ?? "cases" // Config

const timer = delay => new Promise(res => setTimeout(res, delay));
const path = `./${group}.csv`

const getPrices = (serverpath) => {
    getJson(serverpath)
        .then(async (value) => {
            for (const item of value) {
                getCSGOMarketData(`${steamAPIBaseURL}${item}`, "lowest_price").then((data => {
                    if (data == undefined) {
                        console.log(`item( ${item} ) is not in the market or not tradable!`)
                        return
                    }
                    const price = formatPrice(data)
                    console.log(`${item}, ${price}`)
                    writeFileSync(path, `${item},${price}\n`, { flag: "a" }, err => {
                        if (err) {
                            console.log("Error: ", err)
                            throw err
                        }
                    })
                }))
                    .catch((error) => { throw error });
                await timer(1500); // Use it Slowly and synchronised, so it wont timeout you
            }
        })
        .catch((error) => {
            console.log(`Error in getPrices:\n ${error.message}`);
            throw error;
        });
}


/*
writeFileSync('./data.csv', "Item, Price\n", err => {
    if (err) {
        console.log("Error: ", err)
        return -1
    }
})
*/
if (existsSync(path)) {
    unlinkSync(path, err => {
        if (err) {
            console.log(err)
        }
    })
}
try {
    getPrices(`http://localhost:4000/${group}`);

} catch (error) {
    console.error(error.message);
}

