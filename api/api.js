const HTMLParser = require("node-html-parser");
const api = {}

api.topic = async function(request, reply) {
    const html = await (await fetch(
        `https://scratch.mit.edu/discuss/topic/${request.params.topic}?page=${request.query.page}`, 
        {
            headers: {
                "Cookie": `scratchsessionsid=${process.env.SESSION_ID}`
            }
        }
    )).text()
    const root = HTMLParser.parse(html)
    const posts = root.querySelectorAll(".blockpost")
    const postsOutput = []
    for (const post of posts) {
        let postData = {}

        let timeStr = post.querySelector(".box-head").children[1].innerText
        let timestamp
        if (timeStr.includes("Today") || timeStr.includes("Yesterday")) {
            if (timeStr.includes("Today")) {
                const today = new Date().toLocaleDateString()
                timestamp = new Date(`${today} ${timeStr.split(" ")[1]} EST`).getTime()
            } else {
                const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString()
                timestamp = new Date(`${yesterday} ${timeStr.split(" ")[1]} EST`).getTime()
            }
        } else {
            timestamp = new Date(timeStr).getTime()
        }

        postData.author = {}
        postData.author.username = post.querySelector(".black.username").innerText
        postData.author.id = parseInt(post.querySelector(".postavatar").querySelector("img").getAttribute("src").split("/")[5].split("_")[0])
        postData.author.postCount = Array.from(post.querySelector(".postleft").querySelector("dl").childNodes).at(-1).textContent.trim().split(" ")[0]
        postData.author.rank = Array.from(post.querySelector(".postleft").querySelector("dl").childNodes).at(-3).textContent.trim().split(" ")[0]
        postData.id = parseInt(post.id.slice(1))
        postData.content = post.querySelector(".post_body_html").innerHTML
        postData.number = parseInt(post.querySelector(".conr").innerText.slice(1))
        postData.time = timeStr
        postData.timestamp = timestamp
        postsOutput.push(postData)
    }
    return JSON.stringify(postsOutput, null, 4)
}

module.exports = api;