
import { writeFileSync, unlinkSync, existsSync } from 'fs'

const baseURL = `https://steamcommunity.com/inventory`

const debug = process.argv.findIndex((e => e === "-d")) !== -1
const debugURL = "http://localhost:4001/data"
const dataPath = "./data.json"

const getInvItems = async (steamid, appId, param) => {
    const items = new Map()
    const dataGroups = new Map()
    let dataJSON = {}
    try {
        const url = debug ? debugURL : `${baseURL}/${steamid}/${appId}/${param}`
        //console.log(url)
        const response = await fetch(url)
        const jsonData = await response.json()

        if (jsonData != null) {
            //console.log(jsonData.assets)
            for (const item of jsonData.assets) {
                const classId = item.classid
                const itemDescription = getItemDesription(classId, jsonData.descriptions)
                const groupName = itemDescription?.tags[0].internal_name
                //console.log(itemDescription?.tags[0].internal_name)

                const amount = items.get(classId)
                if (amount == undefined || !items.has(classId)) {
                    items.set(classId, 1)
                } else {
                    items.set(classId, amount + 1)
                }
                if (groupName == null) continue

                const entry = dataGroups.get(groupName)
                if (entry == undefined || !dataGroups.has(groupName)) {
                    dataGroups.set(groupName, new Set([itemDescription.market_hash_name]))
                } else {
                    dataGroups.get(groupName).add(itemDescription.market_hash_name)
                }
            }
            printSteamItemsMap(new Map([...items.entries()].sort((a, b) => { // "sorted Map for ItemAmount"
                return a[1] > b[1] ? -1 : 1
            })), jsonData);

            //console.log(dataGroups)
            dataGroups.forEach((v,k,m) => {
                dataGroups.set(k,Array.from(v))
            })
            dataJSON = Object.fromEntries(dataGroups)

            writeFileSync(dataPath, JSON.stringify(dataJSON))

            console.log(dataJSON)
        } else {
            console.log("Probably a timeout :(")
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

const getItemDesription = (classId, jsonDataDescription) => {
    return jsonDataDescription.find(entry => {
        return entry.classid === classId
    })
}

getInvItems("76561198072044657", "730", "2")

export { getInvItems }
