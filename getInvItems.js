
const baseURL = `https://steamcommunity.com/inventory`

const debug = true
const debugURL = "http://localhost:4001/data"

const getInvItems = async (steamid, appId, param) => {
    const items = new Map()
    try {
        const url = debug ? debugURL : `${baseURL}/${steamid}/${appId}/${param}`
        //console.log(url)

        const response = await fetch(url)
        const jsonData = await response.json()

        if (jsonData != null) {
            //console.log(jsonData.assets)
            for (const item of jsonData.assets) {
                const amount = items.get(item.classid)
                if (amount == undefined || !items.has(item.classid)) {
                    items.set(item.classid, 1)
                } else {
                    items.set(item.classid, amount + 1)
                }
            }
            printSteamItemsMap(new Map([...items.entries()].sort((a,b) => { // "sorted Map for ItemAmount"
                return a[1] > b[1] ? -1 : 1
            })), jsonData);
        }
    } catch (e) {
        console.log("MEEEN ERROR:", e)
    }
}

const printSteamItemsMap = (map, data) => {
    if (map == null) {
        throw "Map is not Initialized"
    }
    if (data == null) {
        throw "Data is not Initialized"
    }
    //console.log(`Item Name, Amount`)
    map.forEach((value, key, map) => {
        let item = ""
        for (const entry of data.descriptions) {
            if (entry.classid === key) {
                item = entry.market_hash_name
            }
        }
        console.log(`${item}, ${value}`);
    })
}

getInvItems("76561198072044657", "730", "2")

export { getInvItems }
