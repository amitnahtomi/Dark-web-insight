const { SocksProxyAgent } = require('socks-proxy-agent')
const axios = require('axios')
const cheerio = require('cheerio')
const agent = new SocksProxyAgent("socks://localhost:9050")

async function request(baseUrl) {
    try {
        const client = axios.create({baseURL: baseUrl, httpAgent: agent})
            const res = await client.get('/')
            return res.data    
        
    }
    catch (err) {
        if(axios.isAxiosError(err)) {
            console.error(err.message);
            console.log("hello");
        }
        return "failed";
    }
}

//setInterval(() => {
    const result = request("http://strongerw2ise74v3duebgsvug4mehyhlpa7f6kfwnas7zofs3kov7yd.onion/all")
result.then((res)=>{
    const $ = cheerio.load(res);
    const pastes = $('.col-sm-12')
    /*for(let i = 0; i < pastes.length; i++) {
        
    }*/
})
//}, 120000);

function getPasteDet(paste) {
    const pasteObj = {
        title: getTitle(paste),
        content: getContent(paste),
        author: getAuthor(paste),
        date: getDate(paste)
    }
    return pasteObj
}

function getTitle(paste) {
    const pasteTitle = cheerio.load(paste)
    const title = (pasteTitle('.col-sm-5').text()).replace(/(\r\n|\n|\r|\t)/gm, "")
    return title
}

function getContent(paste) {
    const pasteContent = cheerio.load(paste)
    const content = (pasteContent('.text').text()).replace(/(\r\n|\r|\t)/gm, "")
    return content
}

function getAuthor(paste) {
    const pasteAuthor = cheerio.load(paste)
    const pasteDetails = (pasteAuthor('.col-sm-6').text()).replace(/(\r\n|\n|\r|\t)/gm, "")
    const splitted = pasteDetails.split(" ")
    const author = splitted.slice(splitted.indexOf("by") + 1, splitted.indexOf("at")).join(" ");   
    return author
} 

function getDate(paste) {
    const pasteDate = cheerio.load(paste);
    const pasteDetails = (pasteDate('.col-sm-6').text()).replace(/(\r\n|\n|\r|\t)/gm, "")
    const splitted = pasteDetails.split(" ")
    const date = splitted.slice(splitted.indexOf("at") + 1, splitted.indexOf("UTCLanguage:")).join(" ");   
    return date
}