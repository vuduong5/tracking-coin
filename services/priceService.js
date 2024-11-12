const dateHelper = require('../helpers/date-helper')

function checkPriceDifferences(coinName, data, threshold = 5) {
    let contracts = data.filter(item => {
        const hasVolume = item.volume24 > 0;

        // Condition 2: timestamp is from today
        const isToday = dateHelper.isToday(item.timestamp);

        // Only include contracts that meet both conditions
        return hasVolume && isToday;
    })

    let coins = [];

    // Iterate through each unique pair in the array
    for (let i = 0; i < contracts.length - 1; i++) {
        for (let j = i + 1; j < contracts.length; j++) {
            const price1 = contracts[i].lastPrice;
            const price2 = contracts[j].lastPrice;

            // Calculate the percentage difference
            const difference = Math.abs((price1 - price2) / price1) * 100;

            // Check if the difference exceeds the threshold
            if (difference >= threshold) {
                console.log(`Price difference alert between exchanges!`);
                console.log(`Exchange 1: ${contracts[i].exchange}, Price: ${price1}`);
                console.log(`Exchange 2: ${contracts[j].exchange}, Price: ${price2}`);
                console.log(`Difference: ${difference.toFixed(2)}%`);
                
                const index1 = coins.indexOf(contracts[i]);
                if(index1 == -1){
                    coins.push(contracts[i]);
                }

                const index2 = coins.indexOf(contracts[j]);
                if(index2 == -1){
                    coins.push(contracts[j]);
                }
            }
        }
    }

    if(coins.length > 0){
        return {
            coinName: coinName,
            exchanges: coins
        };
    }else{
        return '';
    }
    
}

function getDifferencePercent(price2, price1){
     // Find the contract with the minimum lastPrice for the given coinName

    const difference = Math.abs((price1 - price2) / price1) * 100;
    return difference.toFixed(2);
}

function getDifference(price2, price1){
    // Find the contract with the minimum lastPrice for the given coinName

   const difference = price1 - price2;
   return difference;
}

module.exports = {
    checkPriceDifferences,
    getDifferencePercent,
    getDifference
}