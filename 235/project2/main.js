const API_KEY = "ilzCDb4pvfIUNWJWOkDTO2evNm9pYopHka9izhyC"
const API_URL = "https://api.nasa.gov/planetary/apod"
let url = "";

const COUNT = "5";

url += API_URL;
url += "?api_key=" + API_KEY;
url += "&count=" + COUNT;

console.log(url);