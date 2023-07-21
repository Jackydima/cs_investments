/**
 * @author    Wolfgang Kowarschick <kowa@hs-augsburg.de>
 * @copyright 2016-2023
 * @license   MIT
 */

/**
 * @param  { string } p_url
 *         The URL of the JSON file to be loaded
 * @return { JSON }  
 *         The JSON content of the file loaded
 */
async function getJson(p_url) {
  return fetch(p_url)
    .then(response => {
      if (response.ok) { return response.json() }
      else { throw new Error(`'${response.url}' not found`) }
    }
    )
}

export default getJson