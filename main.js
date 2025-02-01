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

const steamAPIBaseURL = "https://steamcommunity.com/market/priceoverview/?currency=3&appid=730&market_hash_name=" // for csgo items in euro

const group = getConfigGroup() ?? "all" // Config

const timer = delay => new Promise(res => setTimeout(res, delay));
let path = [`./${group}.csv`];

const queAmount = 10;
const getPrices = (serverpath) => {
    getJson(serverpath)
        .then(async (value) => {
            console.log(`Group=${group}`)

            let groupCounter = 0;
            let counter = 0;
            let shouldWait = false;

            for (const g in value) {
                if (g !== group && group.toLowerCase() !== "all") {
                    continue;
                }
                console.log(`Adding new Group: ${g}`);
                const groupPath = `./${g}.csv`;
                if (existsSync(groupPath)) {
                    unlinkSync(groupPath, err => {
                        if (err) {
                            console.log(err);
                        }
                    })
                }
                path[groupCounter] = groupPath;
                
                let entryCount = 0;
                for (const item of value[g]) {
                    if ((counter % queAmount) >= queAmount-1) {
                        console.log("We waitin");
                        await timer(20000);
                    }
                    while (true) {
                        // median_price or lowest_price
                        await getCSGOMarketData(`${steamAPIBaseURL}${item}`, "median_price").then((data => {
                            if (data == undefined) {
                                console.log(`item( ${item} ) is not in the market or not tradable!`);
                                data = "0,00";
                            }
                            const price = formatPrice(data)
                            console.log(`${item.replaceAll('%26', '&')}, ${price}`)
                            writeFileSync(path[groupCounter], `${item.replaceAll('%26', '&')},${price}\n`, { flag: "a" }, err => {
                                if (err) {
                                    console.log("Error: ", err);
                                    throw err;
                                }
                            })
                        })).catch((error) => {
                            if (error.cause === "timeout") {
                                console.log(`\nWe Got A timeout, we should wait a bit\n`)
                                shouldWait = true;
                            } else {
                                throw error;
                            } 
                        });
                        if (shouldWait) {
                            await timer(30000);
                            shouldWait = false;
                            continue;
                        }
                        break;
                    }
                    counter++;
                    entryCount++;
                    await timer(1000); // Use it Slowly and synchronised, so it wont timeout you
                }
                console.log(`In Group (${g}) are ${entryCount} Entries`);
                groupCounter++;
                counter = counter % queAmount;
                console.log(`Finished ${g} successfully\n`);
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
    getPrices(`http://localhost:4000/Categories`);
} catch (error) {
    console.error(error.message);
}

