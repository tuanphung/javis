const fs = require('fs');

const Web3 = require('web3');

let rawdata = fs.readFileSync('alpha-pools.json');
let pools = JSON.parse(rawdata);
console.log(pools);

var ticker = 0
var add = 'wss://bsc-ws-node.nariox.org:443'
var web3WS = new Web3(new Web3.providers.WebsocketProvider(add));
const subscription = web3WS.eth.subscribe('pendingTransactions', (err, res) => {
    if (err) console.error(err);
});

subscription.on('data', (txHash) => {
    setTimeout(async () => {
    try {
        let tx = await web3WS.eth.getTransaction(txHash);
        // console.log(tx.to.toLowerCase())

        for (var poolName in pools) {
            if (ticker % 10000 == 0) {
                // console.log(txHash)
            }
            var address = pools[poolName].address

            if (tx && tx.to.toLowerCase() == address.toLowerCase()) {
                console.log(`[ALERT] There is new reInvest triggered on pool ${poolName} by ${tx.from} in transaction ${txHash}`)
            }

            ticker = ticker + 1
        }

        // if (tx && tx.to != null && tx.to == myPendingTx.to && tx.from != myPendingTx.from && tx.gasPrice > myPendingTx.gasPrice) {
        //     console.log('[Alert] Found counter transaction: ',txHash ); // transaction hash

        //     console.log('TX confirmation: ',tx.transactionIndex ); // "null" when transaction is pending
        //     console.log('TX nonce: ',tx.nonce ); // number of transactions made by the sender prior to this one
        //     console.log('TX block hash: ',tx.blockHash ); // hash of the block where this transaction was in. "null" when transaction is pending
        //     console.log('TX block number: ',tx.blockNumber ); // number of the block where this transaction was in. "null" when transaction is pending
        //     console.log('TX sender address: ',tx.from ); // address of the sender
        //     console.log('TX amount(in Ether): ',web3.utils.fromWei(tx.value, 'ether')); // value transferred in ether
        //     console.log('TX date: ',new Date()); // transaction date
        //     console.log('TX gas price: ',tx.gasPrice ); // gas price provided by the sender in wei
        //     console.log('TX gas: ',tx.gas ); // gas provided by the sender.
        //     console.log('TX input: ',tx.input ); // the data sent along with the transaction.
        //     console.log('=====================================') // a visual separator

        //     // overwrite existing transaction with higher gas price
        //     console.log('overwrite transaction') // a visual separator
            
        //     // increase minimum 10%
        //     myPendingTx.gasPrice = parseInt(tx.gasPrice) * 1.101
            
        //     await sendTransaction(myPendingTx)
        // }
    } catch (err) {
        console.error(err);
    }
    })
});