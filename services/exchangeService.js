const Exchanges = require('../enum')
const MexcService = require('../services/mexcService')
const GateService = require('../services/gateService')
const BinanceService = require('../services/binanceService')
const OKXService = require('../services/okxService')
const BybitService = require('../services/bybitService')
const KucoinService = require('../services/kucoinService')

const mexcService = new MexcService();
const gateService = new GateService();
const binanceService = new BinanceService();
const okxService = new OKXService();
const bybitService = new BybitService();
const kucoinService = new KucoinService();

async function handleContract(contract){
  let result = {
    coinName: contract.coinName,
    exchanges: []
  }

  for (const exchange of contract.exchanges) {
    const contractDetail = await getContractDetail(exchange, contract.symbol);

    if (typeof contractDetail === 'object' && contractDetail !== null) {
      result.exchanges.push(contractDetail);
    }
  }

  return result;
}

async function getContractDetail(cex, symbol){
    switch (cex) {
        case Exchanges.BITGET:
          return 'You selected Bitget exchange.';
        case Exchanges.BYBIT:
          return await bybitService.getContractDetail(symbol);
        case Exchanges.BINANCE:
          return await binanceService.getContractDetail(symbol);
        case Exchanges.HTX:
          return 'You selected HTX exchange.';
        case Exchanges.OKX:
          return await okxService.getContractDetail(symbol);
        case Exchanges.MEXC:
          return await mexcService.getContractDetail(symbol);
        case Exchanges.KUCOIN:
          return await kucoinService.getContractDetail(symbol);
        case Exchanges.GATEIO:
          return await gateService.getContractDetail(symbol);
        default:
          return 'Unknown exchange!';
      }
}

module.exports = {
    getContractDetail,
    handleContract
}