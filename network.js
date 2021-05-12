const Web3 = require('web3');

const rpcURLs = [
    'https://spring-morning-glade.bsc.quiknode.pro/be44e4d0b7eea84ef6726c5ce45221c4bab9c14c/',
    // 'https://bsc-dataseed.binance.org',
    // 'https://bsc-dataseed1.defibit.io',
    // 'https://bsc-dataseed1.ninicoin.io',
]

var _web3Pool = []
var poolIndex = 0

function init() {
    rpcURLs.forEach( url => {
        _web3Pool.push(new Web3(url))
    })
}
init()

// Export methods
function getWeb3() {
    let w3 = _web3Pool[poolIndex]
    poolIndex += 1
    if (poolIndex >= _web3Pool.length) {
        poolIndex = 0
    }

    return w3
}
module.exports.getWeb3 = getWeb3

// The paid node, only use for important action such as submit transactions
module.exports.getWeb3Private = function() {
    return new Web3('https://spring-morning-glade.bsc.quiknode.pro/be44e4d0b7eea84ef6726c5ce45221c4bab9c14c/')
}

module.exports.getGasPrice = async function() {
    try {
        // Update global gasPrice
        return parseInt(await getWeb3().eth.getGasPrice())
    }
    catch (err) {
        // console.log(err)
        console.log(`network - getGasPrice failed`)
        return 0
    }
}