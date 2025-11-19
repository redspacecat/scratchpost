const path = require("path");
const api = require("api.js");
const fs = require("fs");

const fastify = require("fastify")({
    ignoreTrailingSlash: true,
});
async function main() {
    await fastify.register(import("@fastify/rate-limit"), { global: true, max: 20, timeWindow: 60 * 1000 });

    // Setup our static files
    fastify.register(require("@fastify/static"), {
        root: path.join(__dirname, "static"),
        prefix: "/",
    });

    fastify.register(require("@fastify/view"), {
        engine: {
            handlebars: require("handlebars"),
        },
        root: path.join(__dirname, "views"),
    });

    fastify.get("/api/topic/:topic", api.topic)

    fastify.listen({ port: process.env.PORT, host: "0.0.0.0" }, function (err, address) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(`Your app is listening on ${address}`);
    });
    // module.exports = fastify
}
main();

export default async function handler(req, res) {
    await fastify.ready();
    fastify.server.emit("request", req, res);
}