import categoryData from "https://cdn.jsdelivr.net/gh/jeffalo/ocular@latest/assets/category-map.js"; // thanks to jeffalo!
const categories = Object.fromEntries(Object.entries(Object.fromEntries(categoryData)).map(([key, value]) => [value, key]));
console.log(categories);
window.invertedCategories = Object.fromEntries(categoryData)

const forms = document.querySelectorAll("form");
for (const form of forms) {
    form.addEventListener("submit", searchForm);
}

function searchForm(e) {
    e.preventDefault(); // Stop the default form submission

    const formData = new FormData(this);
    const params = new URLSearchParams();

    // Iterate over form data and only append non-empty values
    for (let [key, value] of formData.entries()) {
        if (value !== "") {
            if (key == "category") {
                value = categories[value];
                if (!value) {
                    continue;
                }
            }
            params.append(key, value);
        }
    }

    // Construct the new URL and redirect
    const newUrl = this.action + "?" + params.toString();
    window.location.href = newUrl;
}