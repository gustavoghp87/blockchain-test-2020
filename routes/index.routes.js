const express = require('express');
const router = express.Router();
var blockchainJson = require('../blockchain.json');
const { CryptoBlock, CryptoBlockchain} = require('./functions');
const fs = require('fs');



router.get('/', (req, res) => {
  res.render('index');
});


router.get('/register', (req, res) => {
  res.render('new', {blockchainJson});
});


router.post('/new', async (req, res) => {

    console.log("Llegó:", req.body)

    const { sender, senderPrivate, recipient, quantity } = req.body;

    if (!sender || !senderPrivate || !recipient || !quantity) {
        res.status(400).send("Complete data")
    };
    try {
        let quant = parseFloat(quantity)
        if (quant<0)
            res.status(400).send("Wrong data")
    } catch(e) {res.status(400).send("Wrong data")};


    // const btcADDRESS = "1GzE6GG3qecDUoGXNyn2zqkRwhhFCZMiqN";
    // const publicKey = "046DF9315458F408E14AAF0DD47DCAA8F7BE4C455387EB0A072DF435873487AD451A757AC420D657EF5C0FCD68BDA0DA013B0017758C5315F47F5C7D936A51EE39";
    // const privateKEY = "KxTsEDQps9UremH1n2RgE7bsP1vUzkoDbdZuhahjsstZNVt8rogf";

    // const btcADDRESS2 = "1B5hPUjVoqmjXEgdEuCWs8sbij1dSYeeVT";
    // const publicKey2 ="04C00AE6AF4756B18EABBE6A664373A2A738EBFD601EF4C2DE8BDBC50FAF1EDC1811127E26C030A6C8C94E5EEE5327D973F93CBD6A4AFD144C394945F20D09A9D0";
    // const privateKEY2 = "KwNQJVX6PCQyrUKZpNx4FeTpwvkeYUB2J5YkUueXAFcUohDXi8hH"
 
    //const bs58 = require('bs58')
    //const { SHA256 } = require('crypto-js');


    // account balance verification
    let balance = 0;
    blockchainJson.blockchain.forEach( chain => {
        if (chain.data.recipient == sender)
            balance += parseFloat(chain.data.quantity);
        if (chain.data.sender == sender)
            balance -= parseFloat(chain.data.quantity);
    });
    console.log("SELLER BALANCE:", balance)

    const pass = true;

    if (pass) {
        // let lastNonce = blockchainJson.blockchain[blockchainJson.blockchain.length-1].nonce;
        let dif = blockchainJson.difficulty;
        let lastTime = blockchainJson.lastTime;
        if (lastTime>2) dif = dif - 1;
        if (lastTime<2) dif = dif + 1;
        console.log("Ult dif:", blockchainJson.difficulty, " , nueva dif:", dif)

        let smashingCoin = new CryptoBlockchain(dif);
    
        const trans1 = {sender, recipient, quantity};
        
        if (smashingCoin.checkChainValidity()) {

            // socket.io on blockchain.json + timestamp

            smashingCoin.addNewBlock(new CryptoBlock(blockchainJson.blockchain.length, Date.now().toString(), trans1));
            const stringify = JSON.stringify(smashingCoin);
            fs.writeFileSync('blockchain.json', stringify, 'utf-8')
            console.log("Transacción ejecutada con éxito !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

            // socket.io emit blockchain.json + timestamp

            res.json({verif:true, balanceProblem:false});
        } else {
            console.log("Falló la verificación     - . - . - . - . - . - . - . - . - . - ");
            res.json({verif:false, balanceProblem:false});
        }
    } else {
        console.log("No le alcanza el dinero");
        res.json({verif:false, balanceProblem: true, balance});
    }

});


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////



router.get('*', (req, res) => {
    res.end("Section not available");
});
  
  
module.exports = router;