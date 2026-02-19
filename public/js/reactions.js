// modified from scratchaddons implementation
// https://github.com/ScratchAddons/ScratchAddons/tree/master/addons/my-ocular

async function reactions(posts) {
    // let posts = document.querySelectorAll(".post");

    for (const i of posts) {
        let postID = parseInt(i.dataset.post);

        let reactionMenuContainerOuter = document.createElement("li");
        let reactionMenuContainer = document.createElement("span");
        reactionMenuContainer.className = "my-ocular-reaction-menu";
        reactionMenuContainerOuter.appendChild(reactionMenuContainer);
        let reactionMenuButton = document.createElement("a");
        reactionMenuButton.href = "";
        reactionMenuButton.className = "my-ocular-reaction-menu-button";
        reactionMenuButton.innerText = "😀";
        reactionMenuButton.title = "Add reaction";
        reactionMenuContainer.appendChild(reactionMenuButton);

        let reactionMenu = document.createElement("span");
        reactionMenu.className = "my-ocular-popup";
        reactionMenuContainer.appendChild(reactionMenu);
        reactionMenuButton.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            reactionMenuContainer.classList.toggle("open");
            for (let otherMenuContainer of document.querySelectorAll(".my-ocular-reaction-menu")) {
                if (otherMenuContainer === reactionMenuContainer) continue;
                otherMenuContainer.classList.remove("open");
            }
        });
        document.body.addEventListener("click", () => reactionMenuContainer.classList.remove("open"));
        reactionMenu.addEventListener("click", (e) => e.stopPropagation()); /* don't close the menu when it's clicked */

        let reactionList = document.createElement("span"); // it's a list item, because its inside the postfootright list. so it's basically a nested list
        reactionList.className = "my-ocular-reaction-list"
        async function makeReactionList(focusedEmoji, isMenuFocused) {
            const reactions = await fetchReactions(postID);

            reactionList.innerHTML = "";
            reactionMenu.innerHTML = "";
            reactions.forEach((reaction) => {
                let reactionButton = reaction.reactions.length !== 0 ? document.createElement("a") : null;
                if (reactionButton) reactionButton.href = "";
                if (reactionButton) reactionButton.className = "my-ocular-reaction-button";
                if (reactionButton) reactionButton.innerText = `${reaction.emoji} ${reaction.reactions.length}`;

                if (reactionButton && reaction.emoji.startsWith(":") && reaction.emoji.endsWith(":")) {
                    // special case for "easter egg emojis", load the emoji from the emoji from https://ocular.jeffalo.net/emojis/:name.png

                    let emojiName = reaction.emoji.slice(1, -1);
                    let url = `https://ocular.jeffalo.net/emojis/${emojiName}.png`;

                    let img = document.createElement("img");
                    img.src = url;
                    img.draggable = false;

                    reactionButton.innerText = "";
                    reactionButton.appendChild(img);

                    let reactionAmount = document.createElement("span");
                    reactionAmount.innerText = ` ${reaction.reactions.length}`;
                    reactionButton.appendChild(reactionAmount);
                }

                let reactionMenuItem = document.createElement("a");
                reactionMenuItem.href = "";
                reactionMenuItem.className = "my-ocular-reaction-button";
                reactionMenuItem.innerText = reaction.emoji;

                if (reaction.emoji.startsWith(":") && reaction.emoji.endsWith(":")) {
                    // special case for "easter egg emojis", load the emoji from the emoji from https://ocular.jeffalo.net/emojis/:name.png

                    let emojiName = reaction.emoji.slice(1, -1);
                    let url = `https://ocular.jeffalo.net/emojis/${emojiName}.png`;

                    let img = document.createElement("img");
                    img.src = url;
                    img.draggable = false;

                    reactionMenuItem.innerText = "";
                    reactionMenuItem.appendChild(img);
                }

                // if (reaction.reactions.find((r) => r.user === username)) {
                //     if (reactionButton) reactionButton.classList.add("selected");
                //     reactionMenuItem.classList.add("selected");
                // }

                if (reactionButton) {
                    let tooltip = document.createElement("span");
                    tooltip.className = "my-ocular-popup";
                    if (reaction.reactions.length <= 5) tooltip.innerText = reaction.reactions.map((user) => user.user).join(", ");
                    else
                        tooltip.innerText =
                            reaction.reactions
                                .slice(0, 5)
                                .map((user) => user.user)
                                .join(", ") + " and others";
                    reactionButton.appendChild(tooltip);
                }

                function react(e, fromMenu) {
                    e.preventDefault();
                    let ocular = window.open(`https://ocular.jeffalo.net/react/${postID}?emoji=${reaction.emoji}`, "ocular", "width=300,height=300");
                    let timer = setInterval(checkClosed, 500);

                    function checkClosed() {
                        if (ocular.closed) {
                            clearInterval(timer);
                            makeReactionList(reaction.emoji, fromMenu);
                        }
                    }
                }
                if (reactionButton) reactionButton.addEventListener("click", (e) => react(e, false));
                reactionMenuItem.addEventListener("click", (e) => react(e, true));

                if (reactionButton) reactionList.appendChild(reactionButton);
                if (reactionButton && focusedEmoji === reaction.emoji && !isMenuFocused) reactionButton.focus();
                reactionMenu.appendChild(reactionMenuItem);
                if (focusedEmoji === reaction.emoji && isMenuFocused) reactionMenuItem.focus();
            });
            if (reactions.some((reaction) => reaction.reactions.length !== 0)) {
                reactionList.appendChild(document.createTextNode("| "));
            }
        }
        i.querySelector(".reactions").replaceWith(reactionMenuContainer);
        i.querySelector(".reactions-list").replaceWith(reactionList);
        // addon.tab.appendToSharedSpace({
        //     space: "forumsBeforePostReport",
        //     scope: i,
        //     element: reactionMenuContainerOuter,
        //     order: 1,
        // });
        // addon.tab.appendToSharedSpace({ space: "forumsBeforePostReport", scope: i, element: reactionList, order: 0 });

        await makeReactionList();
    }
}

async function fetchReactions(id) {
    const response = await fetch(`https://my-ocular.jeffalo.net/api/reactions/${id}`);
    return response.json();
}
