const dateHelper = require('../helpers/date-helper')
const Exchanges = require('../enum')
const axios = require('axios');

class BybitService{

    async getContractDetail(symbol){
        try {
            const response = await axios.get(`https://api.bybit.com/v5/market/tickers?category=linear&symbol=${symbol.replaceAll('_', '')}`);
            const coinDetail = response.data.result.list[0];
            const timestamp = response.data.time;
            if(coinDetail){
                let detail = this.formatCoinDetail(symbol, timestamp, coinDetail);
                
                // Format the contract details into the required structure
                return detail;
            }

            return {};
            
        } catch (error) {
            return `BYBIT Error fetching contract details: ${symbol}`;
        }
    }

    formatCoinDetail(symbol, timestamp, detail){
        return {
            symbol: symbol,
            lastPrice: this.toDecimal(detail.lastPrice),
            volume24: this.toDecimal(detail.volume24h),
            fundingRate: this.toDecimal(detail.fundingRate),
            timestamp: this.toDecimal(timestamp),
            dateFormat: dateHelper.convertTimestampToDateTime(timestamp),
            exchange: Exchanges.BYBIT
        }
    }
    
    toDecimal(text){
        return parseFloat(text)
    }
}

module.exports = BybitService;
