"use strict";

const express = require("express");

const common = require("./common");
const getBlkNum = require("./getBlkNum");
const sendTxInfo = require("./sendTxInfo");

const app = express();

app.use(express.json());

app.post("/json_rpc", async function(req, res) {
    try {
        let json_data = req.body;
        console.log("JSON Data Received: ");
        console.log(json_data);
        console.log("============================================================");
        if (json_data["method"] === "getblockcount") {
            getBlkNum(res);
            return;
        }
        if (json_data["method"] === "sendtransactioninfo") {
            sendTxInfo(json_data, res);
            return;
        }
    } catch (err) {
        console.log("Error Encountered: ");
        console.log(err.toString());
        console.log("============================================================");
        res.json({"error": err.toString()});
        return;
    }
    res.json({"result": "received"});
});

let server = app.listen('16666');
server.timeout = 360000;
console.log("Server started...");

process.on("SIGINT", () => {
    console.log("Shutting down...");
    process.exit();
});
