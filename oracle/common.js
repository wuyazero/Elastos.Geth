"use strict";

const Web3 = require("web3");
const web3 = new Web3("http://127.0.0.1:6666");
const ks = require("./ks");
const acc = web3.eth.accounts.decrypt(ks.kstore, ks.kpass);
const ctrt = require("./ctrt");
const contract = new web3.eth.Contract(ctrt.abi);
contract.options.address = ctrt.address;
module.exports = {
    web3: web3,
    acc: acc,
    contract: contract
}
