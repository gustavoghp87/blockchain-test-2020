const { SHA256 } = require('crypto-js');
var blockchainJson = require('../blockchain.json');



class CryptoBlock {

    constructor(index, timestamp, data, precedingHash=" ") {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.precedingHash = precedingHash;
        this.hash = this.computeHash();
        this.nonce = 0;
    };

    computeHash () {
        return SHA256(this.index + this.precedingHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    };

    proofOfWork(difficulty) {
        console.log("Inicio proof of work")
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.computeHash();
            // console.log("Comparando", this.hash)
        };
        console.log("Fin proof of work")
    };

    proofOfWork2(difficulty) {
        console.log("Inicio proof of work aleatorio")
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce = Math.floor( Math.random() * Math.floor(Number.MAX_SAFE_INTEGER) );
            this.hash = this.computeHash();
            // console.log("Comparando", this.hash, " nonce:", this.nonce)
        };
        console.log("Fin proof of work")
    };
};


class CryptoBlockchain{

    constructor(dif) {
        this.blockchain = blockchainJson.blockchain;
        this.difficulty = dif;
        this.lastTime;
    };

    // startGenesisBlock() {
    //     return new CryptoBlock(0, "01/01/2020", "Initial Block in the Chain", "0");
    // }

    obtainLatestBlock() {
        return this.blockchain[this.blockchain.length - 1];
    };

    addNewBlock(newBlock) {
        newBlock.precedingHash = this.obtainLatestBlock().hash;
        // newBlock.hash = newBlock.computeHash();
        const { performance } = require('perf_hooks');
        var t0 = performance.now()
        newBlock.proofOfWork2(this.difficulty);
        var t1 = performance.now()
        var minutes = Math.floor( (t1-t0)/1000/60 )
        console.log("Call to doSomething took " + (t1 - t0) + " milliseconds. \nMinutes:", minutes)

        this.lastTime = minutes;
        this.blockchain.push(newBlock);
    };

    // computeHash(){
    //     console.log("Usado ,,,,,,,")
    //     return SHA256(this.index + this.precedingHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    // };

    checkChainValidity() {
        for (let i=1; i<21; i++) {
            const currentBlock = this.blockchain[i];
            const precedingBlock= this.blockchain[i-1];
            const hash = SHA256(currentBlock.index + currentBlock.precedingHash + currentBlock.timestamp + JSON.stringify(currentBlock.data)).toString();
          if (currentBlock.hash !== hash || currentBlock.precedingHash !== precedingBlock.hash) {
            console.log("FAIL TRANSACTION:", i)
            return false;
          };
        };
        for (let i=21; i<this.blockchain.length; i++) {
            const currentBlock = this.blockchain[i];
            const precedingBlock= this.blockchain[i-1];
            const hash = SHA256(currentBlock.index + currentBlock.precedingHash + currentBlock.timestamp + JSON.stringify(currentBlock.data) + currentBlock.nonce).toString();
          if (currentBlock.hash !== hash || currentBlock.precedingHash !== precedingBlock.hash) {
            console.log("FAIL TRANSACTION:", i)
            return false;
          };
        };
        console.log("Cadena al momento verificada con éxito")
        return true;
    };

    checkChainValidity(long) {
        for(let i=this.blockchain.length-long; i<this.blockchain.length; i++){
            const currentBlock = this.blockchain[i];
            const precedingBlock= this.blockchain[i-1];
            const hash = SHA256(currentBlock.index + currentBlock.precedingHash + currentBlock.timestamp + JSON.stringify(currentBlock.data)).toString();
            console.log("    ", i, " ", hash, currentBlock.hash)

          if (currentBlock.hash !== hash || currentBlock.precedingHash !== precedingBlock.hash) {
            console.log("FAIL TRANSACTION:", i)
            return false;
          }
        }
        console.log("Cadena al momento verificada con éxito")
        return true;
    };

};


module.exports = { CryptoBlock, CryptoBlockchain };
