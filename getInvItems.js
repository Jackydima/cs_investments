import { getConfigSteamId, getInvItems } from "./getSteamInvData.js"

try {
    const debug = process.argv.findIndex((e => e === "-d")) !== -1
    const appId ="730"
    const inventoryGroup = "2"
    const dataPath = "./data.json"
    const configSteamId = getConfigSteamId() ?? undefined
    await getInvItems(configSteamId, appId, inventoryGroup, dataPath, debug)
} catch (e) {
    console.log(`Error:\n${e}`)
    process.exit(1)
}
