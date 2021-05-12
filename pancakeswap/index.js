const fs = require('fs');
const network = require('network')

let rawdata = fs.readFileSync('./pancakeswap/mainnet.json');
let contractInfo = JSON.parse(rawdata)

function getCakeTokenContract() {
  let web3 = network.getWeb3()
  return new web3.eth.Contract(contractInfo["cake"].abi, contractInfo["cake"].address)
}

function getCakeMasterChefContract() {
  let web3 = network.getWeb3()
  return new web3.eth.Contract(contractInfo["masterchef"].abi, contractInfo["masterchef"].address)
}

module.exports.getHoldingCake = async function getHoldingCake(address) {
  let contract = getCakeTokenContract()

  return new Promise((resolve) => {
      contract.methods.balanceOf(address).call(function (err, res) {
          if (err) {
            // console.log("An error occured", err)
            resolve(0)
            return
          }

          resolve(res)
        })
  })
}

module.exports.getPendingCakeFromChef = async function getPendingCakeFromChef(pid, address) {
  let contract = getCakeMasterChefContract()

    return new Promise((resolve) => {
      contract.methods.pendingCake(pid, address).call(function (err, res) {
            if (err) {
              // console.log("An error occured", err)
              resolve(0)
              return
            }

            resolve(res)
          })
    })
}