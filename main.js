import { getCSGOMarketData, formatPrice } from './getCSGOMarketData.js';
import getJson from './getJson.js';

const timer = delay => new Promise(res => setTimeout(res, delay));

const getPrices = () => {

    getJson("http://localhost:4000/cases")
        .then(async (value) => {
            for (const item in value) {
                getCSGOMarketData(value[item]["url"], "lowest_price").then((value => {
                    const price = formatPrice(value);
                    console.log(`${item}, ${price}`);
                }))
                .catch((error) => { throw error } );
                await timer(100);
            }
        }
        )
        .catch((error) => {
            console.log(`Error in getPrices:\n ${error.message}`);
            throw error;
        });

}

try {
    getPrices();
} catch (error) {
    console.error(error.message);
}