const network = require('network.js')
const utils = require('utils')

const alphaPools = require('pools/alpha')

var _gasPrice = 0

async function getGasPrice() {
    if (_gasPrice == 0) {
        _gasPrice = await network.getGasPrice()
    }

    return _gasPrice
}
module.exports.getGasPrice = getGasPrice

// action: 'reinvest'
module.exports.consult = async function(action, options) {
    let poolName = options.poolName
    let from = options.from
    let optimalGasPrice = options.optimalGasPrice

    let pools = alphaPools.getPools()
    const address = pools[poolName].address
    const abi = pools[poolName].abi

    // Init contract instance
    let web3 = network.getWeb3()
    const contract = new web3.eth.Contract(abi, address)

    const query = contract.methods.reinvest()
    const encodedABI = query.encodeABI();
    
    let gasPrice = await getGasPrice()
    const tx = {
        from: from,
        to: address,
        gas: 800000,
        // gasPrice: optimalGasPrice || (parseInt(web3.utils.toWei('7', 'gwei'), 10) + 1),
        gasPrice: optimalGasPrice || (gasPrice + 1),
        data: encodedABI,
    }

    return tx
}

// Worker job
async function init() {
    while(true){
        try {
            // Update global gasPrice
            let latestGasPrice = await network.getGasPrice()
            if (latestGasPrice == 0) {
                await utils.sleep(10000)
                continue
            }

            _gasPrice = latestGasPrice
        }
        catch (err) {
            console.log(err)
        }

        await utils.sleep(10000)
    }
}

init()