const dateHelper = require('../helpers/date-helper')
const Exchanges = require('../enum')
const axios = require('axios');

class MexcService{

    async getContractDetail(symbol){
        try {
            const response = await axios.get(`https://contract.mexc.com/api/v1/contract/ticker?symbol=${symbol}`);
            const coinDetail = response.data.data;
            
            // Format the contract details into the required structure
            return this.formatCoinDetail(coinDetail);
        } catch (error) {
            console.error('Error fetching contract details:', error);
            return [];
        }
    }

    formatCoinDetail(detail){
        return {
            symbol: detail.symbol,
            lastPrice: detail.lastPrice,
            volume24: detail.volume24,
            fundingRate: detail.fundingRate * 100,
            timestamp: detail.timestamp,
            dateFormat: dateHelper.convertTimestampToDateTime(detail.timestamp),
            exchange: Exchanges.MEXC
        }
    } 
}

module.exports = MexcService;
