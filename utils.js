module.exports.sleep = function(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

module.exports.rollDice = function (min, max) {
    return (min-1) + Math.ceil(Math.random() * (max-min + 1))
}