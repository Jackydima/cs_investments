# CS investments

## Info
This is a private Test-Project for getting Data out of the Steammarket. 

## Tools
This project mainly written in Javascript. It uses the node npm packetmanager.

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
Please provide a data.json file that takes the items with the given url

- open another terminal and type in to get the data.csv
~~~
npm run dev
~~~

## Get your Steam Inv Items Amount
- open the getInvItems.js file and write your steamId in it with the Game ID and the specific steam parameter

~~~
npm run getInvItems
~~~

It should print you a sorted List (of a Map) of your items with your parameters

