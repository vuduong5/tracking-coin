const priceService = require('./services/priceService')
const dateHelper = require('./helpers/date-helper')

function buildMessage(coin){
    let stringBuilder = `<b>Symbol</b>: ${coin.coinName} (KÈO) \n`;
    stringBuilder += '---- Future -----\n'

    const minPriceContract = coin.exchanges.reduce((min, current) => 
        current.lastPrice < min.lastPrice ? current : min
    );

    coin.exchanges.forEach(exchange => {
        if(minPriceContract !== exchange){
            const priceDifference = priceService.getDifferencePercent(minPriceContract.lastPrice, exchange.lastPrice);
            const fundingDifference = priceService.getDifference(minPriceContract.fundingRate, exchange.fundingRate);

            stringBuilder += `<b>${minPriceContract.exchange}</b> - <b>${exchange.exchange}</b>\n`;
            stringBuilder += `<i>Price D:</i>         <code><b>${priceDifference}</b></code>%\n`;
            stringBuilder += `<i>Fund D:</i>         <code><b>${fundingDifference}</b></code>%\n`;

            stringBuilder += `🔴 ${exchange.exchange} : ${exchange.lastPrice} |  ${exchange.fundingRate} | ${dateHelper.convertTimestampToTime(exchange.timestamp)} | ${exchange.volume24}\n`;
            stringBuilder += `🟢 ${minPriceContract.exchange} : ${minPriceContract.lastPrice} |  ${minPriceContract.fundingRate} | ${dateHelper.convertTimestampToTime(minPriceContract.timestamp)} | ${minPriceContract.volume24}\n`;
            stringBuilder += '\n'
        }
    }) 
    return stringBuilder;
}

module.exports = {
    buildMessage
}