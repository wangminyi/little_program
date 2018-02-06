function _sum(a, b) {
    return a + b;
}

function array(from, to) {
    var result = [];
    for(var i = from; i <= to; i++){
        result.push(i);
    }
    return result;
}

module.exports.sum = _sum
module.exports.array = array