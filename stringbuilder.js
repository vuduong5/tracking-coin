function buildMessage(coin){
    let stringBuilder = `--------------------------------------------------------------------\n`

    stringBuilder += `Coin ${coin.coinName} \n`;

    coin.exchanges.forEach(exchange => {
        stringBuilder += `----- ${exchange.exchange} ----- : ${exchange.lastPrice} | ${exchange.dateFormat} \n`;
    })

    stringBuilder += `--------------------------------------------------------------------\n`
    
    return stringBuilder;
}

module.exports = {
    buildMessage
}