const dateHelper = require('../helpers/date-helper')
const Exchanges = require('../enum')
const axios = require('axios');

class KucoinService{

    async getContractDetail(symbol){
        try {
            let updatedSymbol = symbol;

            if(symbol === 'BTC_USDT'){
                updatedSymbol = 'XBT_USD'
            }
            const response = await axios.get(`https://api-futures.kucoin.com/api/v1/contracts/${symbol.replaceAll('_','')}M`);
            const coinDetail = response.data.data;
            
            if(coinDetail){
                let detail = this.formatCoinDetail(symbol, coinDetail);

                await this.bindFundingRate(updatedSymbol, detail);

                // Format the contract details into the required structure
                return detail;
            }

            return {};
            
        } catch (error) {
            console.error('Error fetching timestamp details:', error);
            return `Binance Error fetching contract details: ${symbol}`;
        }
    }

    async bindFundingRate(symbol, detail){
        try {
            const response = await axios.get(`https://api-futures.kucoin.com/api/v1/ticker?symbol=${symbol.replaceAll('_','')}M`);
            const data = response.data.data;

            let lastPrice = data ? this.toDecimal(data.price) : 0;
            let timestamp = data ? this.toDecimal(data.ts) / 1000000 : 0;
            
            detail.lastPrice = lastPrice;
            detail.timestamp = timestamp;
            detail.dateFormat = dateHelper.convertTimestampToDateTime(timestamp);
            
        } catch (error) {
            console.error('Error fetching timestamp details:', error);
            return [];
        }
    }

    formatCoinDetail(symbol, detail){
        return {
            symbol: symbol,
            lastPrice: '',
            volume24: this.toDecimal(detail.volumeOf24h),
            fundingRate: this.toDecimal(detail.fundingFeeRate) * 100,
            timestamp: '',
            dateFormat: '',
            exchange: Exchanges.KUCOIN
        }
    }
    
    toDecimal(text){
        return parseFloat(text)
    }
}

module.exports = KucoinService;
