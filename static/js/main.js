function htmlToNode(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  return div.firstChild;
}

(async function () {
    const topic = location.pathname.split("/").at(-1);
    const page = new URLSearchParams(location.search).get("page") ?? 1;
    let [postCounts, posts] = await Promise.all([
        await fetch("https://raw.githubusercontent.com/redspacecat/scratch-forums-data/main/post_counts.txt"),
        await fetch(`/api/topic/${topic}?page=${page}`)
    ])
    postCounts = await postCounts.text()
    posts = await posts.json()
    const container = document.querySelector("#posts_container")

    for (const post of posts) {
        const basePost = `<div class="post">
    <div class="date"></div>
    <div class="container">
        <div class="left">
            <div class="username"></div>
            <img id="user-img">
        </div>
        <div class="right">
            <div class="content"></div>
        </div>
    </div>
</div>`
console.log(basePost.replaceAll(/\n[ ]+/g, ""))
        const newEl = htmlToNode(basePost.replaceAll(/\n[ ]+/g, ""))
        console.log(newEl)
        newEl.querySelector(".date").innerText = post.time
        newEl.querySelector(".username").innerText = post.author.username
        newEl.querySelector("img").src = `https://cdn2.scratch.mit.edu/get_image/user/${post.author.id}_90x90.png`
        newEl.querySelector(".content").innerHTML = post.content
        container.appendChild(newEl)
    }
})();