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
        postData.author = {}
        postData.author.username = post.querySelector(".black.username").innerText
        postData.author.id = parseInt(post.querySelector(".postavatar").querySelector("img").getAttribute("src").split("/")[5].split("_")[0])
        postData.id = parseInt(post.id.slice(1))
        postData.content = post.querySelector(".post_body_html").innerHTML
        postData.number = parseInt(post.querySelector(".conr").innerText.slice(1))
        postData.time = post.querySelector(".box-head").children[1].innerText
        postsOutput.push(postData)
    }
    return JSON.stringify(postsOutput, null, 4)
}

module.exports = api;