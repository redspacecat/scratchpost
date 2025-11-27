const HTMLParser = require("node-html-parser");
const api = {};

api.topic = async function (request, reply) {
    try {
        const mode = request.params.topic ? "topic" : "post";

        const html = await (
            await fetch("https://renderapi.quuq.dev/proxy", {
                headers: {
                    "X-URL": mode == "topic" ? `https://scratch.mit.edu/discuss/topic/${request.params.topic}?page=${request.query.page}` : `https://scratch.mit.edu/discuss/post/${request.params.post}/`,
                    "X-Cookies": JSON.stringify({ scratchsessionsid: process.env.SESSION_ID }),
                },
                redirect: "follow",
            })
        ).text();
        const root = HTMLParser.parse(html);
        if (root.querySelector(".status-code")) {
            return reply.status(404).send({error: "Not found"})
        } else if (root.querySelector("#page-403")) {
            return reply.status(403).send({error: "Unauthorized"})
        }
        const posts = root.querySelectorAll(".blockpost");
        const output = {};

        const subforumEl = root.querySelector(".linkst").querySelector("ul").children[1].querySelector("a");
        const topicEl = root.querySelector(".linkst").querySelector("ul").children[2];
        output.subforum = {
            name: subforumEl.innerText,
            id: parseInt(subforumEl.getAttribute("href").split("/")[2]),
        };

        output.topic = {
            name: topicEl.childNodes[0].textContent.slice(2).trim(),
            id: parseInt(topicEl.querySelector("a").getAttribute("href").split("/")[4]),
            currentPage: parseInt(root.querySelector(".pagination .current.page")?.innerText || 1),
            pageCount: parseInt(root.querySelector(".pagination") ? Array.from(root.querySelector(".pagination").children).at(-2).innerText: 1),
        };

        const postsOutput = [];
        output.posts = postsOutput;
        for (const post of posts) {
            let postData = {};

            let timeStr = post.querySelector(".box-head").children[1].innerText;
            let timestamp;
            if (timeStr.includes("Today") || timeStr.includes("Yesterday")) {
                if (timeStr.includes("Today")) {
                    const today = new Date().toLocaleDateString();
                    timestamp = new Date(`${today} ${timeStr.split(" ")[1]} EST`).getTime();
                } else {
                    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString();
                    timestamp = new Date(`${yesterday} ${timeStr.split(" ")[1]} EST`).getTime();
                }
            } else {
                timestamp = new Date(timeStr).getTime();
            }

            postData.author = {};
            postData.author.username = post.querySelector(".black.username").innerText;
            postData.author.id = parseInt(post.querySelector(".postavatar").querySelector("img").getAttribute("src").split("/")[5].split("_")[0]);
            postData.author.postCount = Array.from(post.querySelector(".postleft").querySelector("dl").childNodes).at(-1).textContent.trim().split(" ")[0];
            postData.author.rank = Array.from(post.querySelector(".postleft").querySelector("dl").childNodes).at(-3).textContent.trim();
            postData.id = parseInt(post.id.slice(1));
            postData.content = post.querySelector(".post_body_html").innerHTML;
            postData.number = parseInt(post.querySelector(".conr").innerText.slice(1));
            postData.time = timeStr;
            postData.timestamp = timestamp;

            if (mode == "topic" || (mode == "post" && (request.query.all == "true" || postData.id == parseInt(request.params.post)))) {
                postsOutput.push(postData);
            }
        }
        return output;
    } catch (e) {
        console.log(e)
        return { error: e.toString()};
    }
};

function handlePostCounts(data) {
    const counts = {};
    for (const item of data) {
        const pieces = item.split(",");
        counts[pieces[0]] = parseInt(pieces[1]);
    }
    return counts;
}

api.user = async function (request, reply) {
    if (!request.params.user) {
        return reply.code(400).send("Specify a username");
    }

    const firstPost = (await (await fetch(`https://redspacecat.alwaysdata.net/first/${request.params.user}`)).text()).split(",")[0];
    if (!firstPost) {
        return reply.code(404).send({error: "User hasn't posted"});
    }

    let postCounts = await await fetch("https://raw.githubusercontent.com/redspacecat/scratch-forums-data/main/post_counts.txt");
    postCounts = await postCounts.text();
    postCounts = handlePostCounts(postCounts.split("\n"));

    const html = await (
        await fetch("https://renderapi.quuq.dev/proxy", {
            headers: {
                "X-URL": `https://scratch.mit.edu/discuss/post/${firstPost}/`,
                "X-Cookies": JSON.stringify({ scratchsessionsid: process.env.SESSION_ID }),
            },
        })
    ).text();
    // const html = await (await fetch(`https://scratch.mit.edu/discuss/post/${firstPost}/`, {
    //     headers: {
    //         "Cookie": `scratchsessionsid=${process.env.SESSION_ID}`
    //     },
    // })).text();

    const root = HTMLParser.parse(html);
    const posts = root.querySelectorAll(".blockpost");
    const output = {};
    for (const post of posts) {
        if (parseInt(post.id.slice(1)) == parseInt(firstPost)) {
            output.username = post.querySelector(".black.username").innerText;
            output.id = parseInt(post.querySelector(".postavatar").querySelector("img").getAttribute("src").split("/")[5].split("_")[0]);
            output.postCount = Array.from(post.querySelector(".postleft").querySelector("dl").childNodes).at(-1).textContent.trim().split(" ")[0];
            output.betterPostCount = parseInt(postCounts[output.username] ?? 1);
            output.rank = Array.from(post.querySelector(".postleft").querySelector("dl").childNodes).at(-3).textContent.trim();
            if (post.querySelector(".postsignature")) {
                post.querySelector(".postsignature").children[0].remove();
                output.signature = post.querySelector(".postsignature").innerHTML.trim();
            } else {
                output.signature = null;
            }
        }
    }
    return output;
};

module.exports = api;
