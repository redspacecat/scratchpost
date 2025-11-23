function htmlToNode(htmlString) {
    var div = document.createElement("div");
    div.innerHTML = htmlString.trim();

    return div.firstChild;
}

function handlePostCounts(data) {
    const counts = {};
    for (const item of data) {
        const pieces = item.split(",");
        counts[pieces[0]] = parseInt(pieces[1]);
    }
    return counts;
}

(async function () {
    const topic = location.pathname.split("/").at(-1);
    const post = location.pathname.split("/").at(-1);
    const page = new URLSearchParams(location.search).get("page") ?? 1;
    let [postCounts, response] = await Promise.all([await fetch("https://raw.githubusercontent.com/redspacecat/scratch-forums-data/main/post_counts.txt"), await fetch(location.pathname.startsWith("/post") ? `/api/post/${post}`: `/api/topic/${topic}?page=${page}`)]);
    postCounts = await postCounts.text();
    postCounts = handlePostCounts(postCounts.split("\n"));
    console.log(postCounts);
    response = await response.json();
    document.querySelector("#subforum").innerHTML = response.subforum.name
    document.querySelector("#subforum").href = "https://scratch.mit.edu/discuss/" + response.subforum.id
    document.querySelector("#topic").innerHTML = response.topic.name
    document.querySelector("#topic").href = "https://scratch.mit.edu/discuss/topic/" + response.topic.id
    document.querySelector("#title_container").hidden = false

    const posts = response.posts

    const container = document.querySelector("#posts_container");

    for (const post of posts) {
        const basePost = `<div class="post">
    <div class="post-top">
        <a class="date" target="_blank"></a>
        <span class="post-number"></span>
    </div>
    <div class="container">
        <div class="left">
            <div class="username"></div>
            <img id="user-img">
            <br>
            <span class="post-count"></span>
        </div>
        <div class="right">
            <div class="content"></div>
        </div>
    </div>
</div>`;
        console.log(basePost.replaceAll(/\n[ ]+/g, ""));
        const newEl = htmlToNode(basePost.replaceAll(/\n[ ]+/g, ""));
        console.log(newEl);
        const postCount = parseInt(postCounts[post.author.username] || 1)
        newEl.querySelector(".date").innerText = post.time;
        newEl.querySelector(".date").href = "https://scratch.mit.edu/discuss/post/" + post.id;
        newEl.querySelector(".post-number").innerText = "#" + post.number;
        newEl.querySelector(".username").innerText = post.author.username;
        newEl.querySelector("img").src = `https://cdn2.scratch.mit.edu/get_image/user/${post.author.id || "default"}_90x90.png`;
        newEl.querySelector(".post-count").innerText = postCount + (postCount == 1 ? " post": " posts");
        newEl.querySelector(".content").innerHTML = post.content;
        container.appendChild(newEl);
    }

    scratchblocks.renderMatching(".blocks", {
        scale: 0.675,
        languages: ["en", "de", "es", "fr", "zh_cn", "pl", "ja", "nl", "pt", "it", "he", "ko", "nb", "tr", "el", "ru", "ca", "id"],
        style: "scratch3",
    });

    document.querySelector("h2").remove()
})();
