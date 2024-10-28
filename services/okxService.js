const dateHelper = require('../helpers/date-helper')
const Exchanges = require('../enum')
const axios = require('axios');

class OKXService{

    async getContractDetail(symbol){
        try {
            const response = await axios.get(`https://www.okx.com/api/v5/market/index-tickers?instId=${symbol.replaceAll('_', '-')}`);
            const coinDetail = response.data.data[0];
            
            if(coinDetail){
                let detail = this.formatCoinDetail(symbol, coinDetail);

                await this.bindFundingRate(detail.symbol, detail);

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
            const response = await axios.get(`https://www.okx.com/api/v5/public/funding-rate?instId=${symbol.replaceAll('_', '-')}-SWAP`);
            const data = response.data.data[0];

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
            lastPrice: this.toDecimal(detail.idxPx),
            volume24: 9999,
            fundingRate: '',
            timestamp: this.toDecimal(detail.ts),
            dateFormat: dateHelper.convertTimestampToDateTime(detail.ts),
            exchange: Exchanges.OKX
        }
    }
    
    toDecimal(text){
        return parseFloat(text)
    }
}

module.exports = OKXService;
