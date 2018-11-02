"use strict";

const express = require("express");
const app = express();
const Web3 = require("web3");
const web3 = new Web3("http://127.0.0.1:6666");
const ks = require("./ks.js");
const acc = web3.eth.accounts.decrypt(ks.kstore, ks.kpass);
const ctrt = require("./ctrt.js");
const contract = new web3.eth.Contract(ctrt.abi);
contract.options.address = ctrt.address;

app.use(express.json());

app.post("/json_rpc", async function(req, res) {
    try {
        let json_data = req.body;
        console.log("JSON Data Received: ");
        console.log(json_data);
        console.log("============================================================");
        if(json_data["method"] === "sendtransactioninfo") {
            console.log("Mainchain Transaction Received: ");
            let mctxhash = json_data["params"]["info"]["payload"]["mainchaintxhash"];
            if (mctxhash.indexOf("0x") !== 0) mctxhash = "0x" + mctxhash;
            console.log(mctxhash);
            console.log("============================================================");

            let txprocessed = await contract.methods.txProcessed(mctxhash).call();
            if (txprocessed) {
                console.log("Mainchain Trasaction Hash already processed: " + mctxhash);
                console.log("============================================================");
                res.json({"error": "ErrMainchainTxDuplicate"});
                return;
            }

            let data = contract.methods.sendPayload(mctxhash).encodeABI();
            let tx = {to: contract.options.address, data: data, from: acc.address};
            let gas = await web3.eth.estimateGas(tx);
            let gasPrice = await web3.eth.getGasPrice();
            gas = String(BigInt(gas) * BigInt(12) / BigInt(10));
            gasPrice = String(BigInt(gasPrice) * BigInt(12) / BigInt(10));

            tx = {to: contract.options.address, data: data, value: "0", gas: gas, gasPrice: gasPrice};
            let stx = await acc.signTransaction(tx);
            let sctxhash = await new Promise((resolve, reject) => {
                web3.eth.sendSignedTransaction(stx.rawTransaction).on("transactionHash", (txhash) => {
                    console.log("Payload sent with Sidechain txHash: " + txhash + " from: " + acc.address);
                    console.log("Mainchain txHash: " + mctxhash);
                    console.log("============================================================");
                    resolve(txhash);
                }).catch((err) => {
                    reject(err);
                });
            });
            res.json({"result":[sctxhash]});
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
