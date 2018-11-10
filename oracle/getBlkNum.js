"use strict";

const common = require("./common");

module.exports = async function(res) {
    console.log("Getting Sidechain Block Number...");
    console.log("============================================================");
    let blkNum = await common.web3.eth.getBlockNumber();
    console.log("Sidechain Block Number: " + blkNum);
    console.log("============================================================");
    res.json({"result": blkNum});
    return;
}
