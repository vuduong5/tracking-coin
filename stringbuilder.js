function buildMessage(coin){
    let stringBuilder = `<b>Symbol</b>: ${coin.coinName} (KÈO) \n`;
    stringBuilder += '---- Future -----\n'

    coin.exchanges.forEach(exchange => {
        stringBuilder += `🟢 ${exchange.exchange} : ${exchange.lastPrice} | ${exchange.dateFormat} \n`;
    })    
    return stringBuilder;
}

module.exports = {
    buildMessage
}