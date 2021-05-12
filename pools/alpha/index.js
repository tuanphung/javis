const fs = require('fs');

let _pools = JSON.parse(fs.readFileSync('./pools/alpha/mainnet.json'));

module.exports.getPools = function() {
    return _pools
}