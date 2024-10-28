const express = require('express');
const Exchanges = require('./enum')
const exchangeService = require('./services/exchangeService')
const priceService = require('./services/priceService')
const telegramService = require('./services/telegramService')
const stringBuilder = require('./stringbuilder');
const dummyData = require('./dummy/contractDetail')
const axios = require('axios');
const app = express();
const port = 3000;

// Function to get contract details from MEXC
async function getContractDetails() {
    try {
        const response = await axios.get('https://contract.mexc.com/api/v1/contract/detail');
        const contracts = response.data.data;

        // Format the contract details into the required structure
        const results = formatContracts(contracts);

        //const filterd = results.filter(s => s.exchanges.indexOf(Exchanges.GATEIO) != -1);
        //const filterd = results.filter(s => s.symbol == 'CTK_USDT');
        const filterd = results.filter(s => s != null);

        const rawData = await runInterval(filterd.slice());
        
        return rawData;
    } catch (error) {
        console.error('Error fetching contract details:', error);
        return [];
    }
}

// Function to format contracts to the requested structure
function formatContracts(contracts) {
    return contracts.map(contract => ({
        symbol: contract.symbol,
        coinName: contract.baseCoinName,
        exchanges: contract.indexOrigin  // Wrap indexOrigin in an array as per your request
    }));
}

async function runInterval(contracts){
    let index = 0;
    let limitItem = 9;
    let limitTime = 9000; //ms
    let results = [];

    while((index * limitItem) <= contracts.length){
        console.log(`Starting with index: ${index}`);
        let filteredContracts = contracts.slice(index * limitItem, index * limitItem + limitItem)
        
        filteredContracts.forEach(async contract => {
            const contractDetail = await exchangeService.handleContract(contract);
            //const contractDetail = dummyData.contract;
            const item = priceService.checkPriceDifferences(contractDetail.coinName, contractDetail.exchanges, 2);            

            if(typeof item === 'object' && item !== null){
                const message = stringBuilder.buildMessage(item);
                console.log(message);

                if(message){
                    telegramService.sendMessage(message);
                }

                results.push(item)
            }
            
        });

        await delay(limitTime);
        
        index++;        
    }

    return results;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Route to handle the index page
app.get('/', async (req, res) => {
    console.time("Execution Time");
    const contracts = await getContractDetails();
    console.timeEnd("Execution Time");
    res.json(contracts); // Send the formatted contract list as a JSON response
});

// app.get('/', async (req, res) => {
//     res.json({'status': 'pingo'})
// });


// Start the Express server
app.listen(port, () => {
    const time = 80000 //1'20s
    // setInterval(() => {
    //     getContractDetails()
    // }, time);
    console.log(`Server is running at http://localhost:${port}`);
});


