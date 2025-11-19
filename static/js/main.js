const topic = 851788
const page = 1
const posts = await (await fetch(`/api/topic/${topic}?page=${page}`)).json()
console.log(posts)