import path from "path";
import express from "express"

const rootRoute = express.Router()

rootRoute.get("/", (_, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "..", "public", "index.html"));
})


export default rootRoute;