import { getCSGOMarketData, formatPrice } from './getCSGOMarketData.js';
import getJson from './getJson.js';
import { writeFileSync, unlinkSync, existsSync } from 'fs'

const group = 'cases' // Config

const timer = delay => new Promise(res => setTimeout(res, delay));
const path = `./${group}.csv`

const getPrices = (serverpath) => {
    getJson(serverpath)
        .then(async (value) => {
            for (const item in value) {
                getCSGOMarketData(value[item]["url"], "lowest_price").then((data => {
                    const price = formatPrice(data)
                    const condition = value[item]["condition"] ?? "-"
                    console.log(`${item}, ${price}, ${condition}`)
                    writeFileSync(path, `${item},${price},${condition}\n`, { flag: "a" }, err => {
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

