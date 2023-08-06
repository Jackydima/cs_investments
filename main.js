import { getCSGOMarketData, formatPrice } from './getCSGOMarketData.js';
import getJson from './getJson.js';
import { writeFileSync } from 'fs'

const timer = delay => new Promise(res => setTimeout(res, delay));

const getPrices = () => {
    getJson("http://localhost:4000/cases")
        .then(async (value) => {
            for (const item in value) {
                getCSGOMarketData(value[item]["url"], "lowest_price").then((value => {
                    const price = formatPrice(value);
                    console.log(`${item}, ${price}`);
                    writeFileSync('./data.csv', `${item}, ${price}\n`, { flag: "a" }, err => {
                        if (err) {
                            console.log("Error: ", err)
                            throw err
                        }
                    })
                }))
                    .catch((error) => { throw error });
                await timer(1000); // Use it Slowly and synchronised, so it wont timeout you
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
try {
    getPrices();
} catch (error) {
    console.error(error.message);
}