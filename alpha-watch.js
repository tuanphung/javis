require('app-module-path').addPath(__dirname);
require('dotenv').config()

const account = require('account')
const network = require('network.js')
const utils = require('utils')

const Web3 = require('web3');

const alphaPools = require('pools/alpha')
const pools = alphaPools.getPools()

var ticker = 0
var url = "wss://spring-morning-glade.bsc.quiknode.pro/be44e4d0b7eea84ef6726c5ce45221c4bab9c14c/";
var add = 'wss://bsc-ws-node.nariox.org:443'
var web3WS = new Web3(new Web3.providers.WebsocketProvider(add));
const subscription = web3WS.eth.subscribe('pendingTransactions', (err, res) => {
    if (err) console.error(err);
});

// New nonce
var nonce = 0

setTimeout(async () => {
    while (true) {
        var trxCount = await web3WS.eth.getTransactionCount(account.secondWallet.address)
        nonce = trxCount
        console.log(nonce)
        utils.sleep(1000)
    }
})

subscription.on('data', (txHash) => {
    // console.log()
    setTimeout(async () => {
    try {
        let tx = await web3WS.eth.getTransaction(txHash);
        // console.log(tx.to.toLowerCase())

        for (var poolName in pools) {
            if (ticker % 10000 == 0) {
                console.log(txHash)
            }
            var address = pools[poolName].address

            if (tx && tx.to.toLowerCase() == address.toLowerCase()
            && tx.from.toLowerCase() == '0xa837a1bfd18129561e9523904810870723bed1e7') {
                console.log(`[ALERT] There is new reInvest triggered on pool ${poolName} by ${tx.from} in transaction ${txHash}, GasPrice ${tx.gasPrice}`)

                const abi = pools[poolName].abi
                const contract = new web3WS.eth.Contract(abi, address)

                const query = contract.methods.reinvest()
                const encodedABI = query.encodeABI();

                const counterTrx = {
                    from: account.secondWallet.address,
                    to: address,
                    gas: 800000,
                    gasPrice: parseInt(tx.gasPrice) + 1,
                    data: encodedABI,
                    nonce: nonce,
                }
                console.log(counterTrx)
                sendTransaction(counterTrx)
            }

            ticker = ticker + 1
        }
    } catch (err) {
        console.log(`ERROR - ${txHash}`)
        // console.error(err);
    }
    })
});

async function sendTransaction(tx, isOrigin) {
    let web3Private = network.getWeb3Private()
    const signPromise = web3Private.eth.accounts.signTransaction(tx, account.secondWallet.privateKey);
    return new Promise((resolve) => {
        return signPromise.then((signedTx) => {
            // raw transaction string may be available in .raw or 
            // .rawTransaction depending on which signTransaction
            // function was called
            const sentTx = web3Private.eth.sendSignedTransaction(signedTx.raw || signedTx.rawTransaction);
            sentTx.on('transactionHash', function(hash){
            })
            sentTx.on('confirmation', (confirmationNumber) => {
                if (confirmationNumber >= 2) {
                    console.log("IMPORTANT - Reinvested")
                    resolve(true)
                }
              })
            sentTx.on("receipt", receipt => {
                console.log("Got Receipt")
                
            });
            sentTx.on("error", err => {
                // do something on transaction error
                console.log(err)
                resolve(false)
            });
        }).catch((err) => {
            // do something when promise fails
            console.log(err)
            resolve(false)
        });
    })
}