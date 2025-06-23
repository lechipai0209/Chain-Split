export const PHANTOM_URL = "https://phantom.app/ul/v1/";

export const buildUrl = (path, params) =>{
  `${PHANTOM_URL}${path}?${params.toString()}`
}