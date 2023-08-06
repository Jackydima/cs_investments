# CS investments

## Info
This is a private Test-Project for getting Data out of the Steammarket.

## Usage
first time usage and after update:
- open a terminal and type there 
~~~
npm i
~~~
This will install the node modules.

- then open a terminal and type in
~~~
npm run server
~~~
This will run a local jsondb server to provide a local json data set of Items in the Format 
~~~
{
    "items": {
        "Horizon": {
            "url": "https://steamcommunity.com/market/priceoverview/?currency=3&appid=730&market_hash_name=Horizon%20Case",
            "condition": null
        },
        ...
    }
}
~~~

- open another terminal and type in to get the data.csv
~~~
npm run dev
~~~