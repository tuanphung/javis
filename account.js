const ethers = require('ethers');

let mnemonic = process.env.seed
let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);
module.exports.privateKey = mnemonicWallet.privateKey
module.exports.address = mnemonicWallet.address
console.log(`Using account ${mnemonicWallet.address}`)