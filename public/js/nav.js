document.addEventListener("DOMContentLoaded", () => {
    const navPlaceholder = document.getElementById("nav-placeholder");

    if (navPlaceholder) {
        fetch('/components/nav/navigation.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error("couldn't load the nav");
                }
                return response.text();
            })
            .then(data => {
                navPlaceholder.innerHTML = data;
            })
            .catch(error => {
                console.error("error loading navigation:", error);
            });
    }
});
