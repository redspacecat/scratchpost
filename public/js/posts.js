function renderPosts(posts, container, minimal=false) {
    // const container = document.querySelector("#posts_container");

    for (const post of posts) {
        const basePost = `<div class="post">
<div class="post-top">
    <a class="date" target="_blank"></a>
    <span class="post-number"></span>
</div>
<div class="container">
    <div class="left">
        <a class="user-link">
            <div class="username"></div>
            <img class="user-img">
        </a>
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
        const postCount = parseInt(postCounts[post.author.username] || 1);
        if (mode == "user") {
            newEl.querySelector(".date").style.visibility = "hidden";
            newEl.querySelector(".content").parentNode.insertBefore(htmlToNode(`<div style="text-align: center;padding-top: 5px;" id="signature_title"><b style="font-size: large;">Signature</b><hr></div>`), newEl.querySelector(".content"));
        }
        newEl.querySelector(".date").innerText = post.time ?? "nothing";
        newEl.querySelector(".date").href = post.id ? "https://scratch.mit.edu/discuss/post/" + post.id : "";
        newEl.querySelector(".post-number").innerText = post.number ? "#" + post.number : "";
        newEl.querySelector(".username").innerText = post.author.username;
        newEl.querySelector(".user-link").href = "https://scratch.mit.edu/users/" + post.author.username;
        newEl.querySelector(".user-img").src = `https://cdn2.scratch.mit.edu/get_image/user/${post.author.id || "default"}_90x90.png`;
        newEl.querySelector(".post-count").innerText = postCount + (postCount == 1 ? " post" : " posts");
        newEl.querySelector(".content").innerHTML = post.content;
        container.appendChild(newEl);
    }

    scratchblocks.renderMatching(".blocks", {
        scale: 0.675,
        languages: ["en", "de", "es", "fr", "zh_cn", "pl", "ja", "nl", "pt", "it", "he", "ko", "nb", "tr", "el", "ru", "ca", "id"],
        style: "scratch3",
    });
}

function htmlToNode(htmlString) {
    var div = document.createElement("div");
    div.innerHTML = htmlString.trim();

    return div.firstChild;
}
