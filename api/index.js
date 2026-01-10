const path = require("path");
const api = require("./api.js");
const fs = require("fs");

const file404 = fs.readFileSync(path.join(__dirname, "../public", "404.html"))

const fastify = require("fastify")({
    ignoreTrailingSlash: true,
});
async function main() {
    await fastify.register(import("@fastify/rate-limit"), { global: true, max: 30, timeWindow: 60 * 1000 });

    // Setup our static files
    fastify.register(require("@fastify/static"), {
        root: path.join(__dirname, "public"),
        prefix: "/",
        wildcard: false
    });

    fastify.register(require("@fastify/view"), {
        engine: {
            handlebars: require("handlebars"),
        },
        root: path.join(__dirname, "views"),
    });

    fastify.setNotFoundHandler((request, reply) => {
        // return reply.code(404).sendFile("404.html")
        return reply.code(404).type("text/html").send(file404)
    });

    fastify.listen({ port: process.env.PORT, host: "0.0.0.0" }, function (err, address) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(`Your app is listening on ${address}`);
    });
}
main();

export default async function handler(req, res) {
    await fastify.ready();
    fastify.server.emit("request", req, res);
}