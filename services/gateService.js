const dateHelper = require('../helpers/date-helper')
const Exchanges = require('../enum')
const axios = require('axios');

class GateService{

    async getContractDetail(symbol){
        try {
            const response = await axios.get(`https://api.gateio.ws/api/v4/futures/usdt/tickers?contract=${symbol}`);
            const coinDetail = response.data[0];

            if(coinDetail){
                let detail = this.formatCoinDetail(coinDetail);
                await this.bindTimestamp(detail.symbol, detail);
                
                // Format the contract details into the required structure
                return detail;
            }

            return {};
            
        } catch (error) {
            return `GateIO Error fetching contract details: ${symbol}`;
        }
    }

    async bindTimestamp(symbol, detail){
        try {
            const response = await axios.get(`https://api.gateio.ws/api/v4/futures/usdt/trades?contract=${symbol}`);
            const data = response.data[0];

            let timestamp = data ? parseFloat(data.create_time) * 1000 : new Date().getTime();
            
            detail.timestamp = timestamp;
            detail.dateFormat = dateHelper.convertTimestampToDateTime(timestamp)
            
        } catch (error) {
            console.error('Error fetching timestamp details:', error);
            return [];
        }
    }

    formatCoinDetail(detail){
        return {
            symbol: detail.contract,
            lastPrice: this.toDecimal(detail.last),
            volume24: this.toDecimal(detail.volume_24h),
            fundingRate: this.toDecimal(detail.funding_rate) * 100,
            timestamp: '',
            dateFormat: '',
            exchange: Exchanges.GATEIO
        }
    }
    
    toDecimal(text){
        return parseFloat(text)
    }
}

module.exports = GateService;
