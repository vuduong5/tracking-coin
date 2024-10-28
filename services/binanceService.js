const dateHelper = require('../helpers/date-helper')
const Exchanges = require('../enum')
const axios = require('axios');

class BinanceService{

    async getContractDetail(symbol){

        try {
            const response = await axios.get(`https://fapi.binance.com/fapi/v1/ticker/24hr?symbol=${symbol.replaceAll('_', '')}`);
            const coinDetail = response.data;
            
            if(coinDetail){
                let detail = this.formatCoinDetail(symbol, coinDetail);
                await this.bindFundingRate(detail.symbol, detail);
                
                // Format the contract details into the required structure
                return detail;
            }

            return {};
            
        } catch (error) {
            //console.error('Error fetching timestamp details:', error);
            return `Binance Error fetching contract details: ${symbol}`;
        }
    }

    async bindFundingRate(symbol, detail){
        try {
            const response = await axios.get(`https://fapi.binance.com/fapi/v1/fundingRate?symbol=${symbol.replaceAll('_', '')}&&limit=1`);
            const data = response.data[0];

            let funcdingRate = data ? this.toDecimal(data.fundingRate) : 0;
            
            detail.fundingRate = funcdingRate;
            
        } catch (error) {
            //console.error('Error fetching timestamp details:', error);
            return [];
        }
    }

    formatCoinDetail(symbol, detail){
        return {
            symbol: symbol,
            lastPrice: this.toDecimal(detail.lastPrice),
            volume24: this.toDecimal(detail.volume),
            fundingRate: '',
            timestamp: detail.closeTime,
            dateFormat: dateHelper.convertTimestampToDateTime(detail.closeTime),
            exchange: Exchanges.BINANCE
        }
    }
    
    toDecimal(text){
        return parseFloat(text)
    }
}

module.exports = BinanceService;
