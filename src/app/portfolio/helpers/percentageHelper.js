export default function (pricesData, balanceData) {
  let eosUsd = 0;
  const priceMap = pricesData.reduce((acc, price) => {
    if (price && price.last && price.currency) {
      if ((price.symbol.indexOf('eusd') === -1)) {
        if (!acc[price.contract]) {
          acc[price.contract] = {};
        }
        acc[price.contract][price.currency] = price.last;
      } else if (price.currency === 'EOS' && (price.symbol.indexOf('eusd') !== -1)) {
        eosUsd = price.last;
      }
    }
    return acc;
  }, {});

  let total = 0;
  const keys = [];

  const coinMap = balanceData.reduce((acc, item) => {
    if (item.rows && item.rows.length > 0) {
      item.rows.forEach((row) => {
        if (row.json && row.json.balance) {
          const floatingAmount = parseFloat(row.json.balance);
          const coinName = row.json.balance
            .replace(/\d*.\d*/, '')
            .trim();

          const priceAccountObj = priceMap[item.account];

          if (!acc[coinName]) {
            acc[coinName] = {};
            acc[coinName].amount = 0;
            acc[coinName].eoseq = 0;
            keys.push(coinName);
          }

          if (priceAccountObj && priceAccountObj[coinName]) {
            acc[coinName].amount += floatingAmount;

            acc[coinName].eoseq = coinName === 'EOS' ? acc[coinName].amount : acc[coinName].amount * priceAccountObj[coinName];
            total += coinName === 'EOS' ? floatingAmount : floatingAmount * priceAccountObj[coinName];
            acc[coinName].contract = priceAccountObj[coinName];
            acc[coinName].price = priceAccountObj[coinName];
          }
        }
      });
    }
    return acc;
  }, {});

  const dataArray = keys
    .map((key) => {
      return {
        ...coinMap[key],
        key,
      };
    })
    .filter(item => item.eoseq !== 0)
    .sort((item1, item2) => item1.eoseq > item2.eoseq ? -1 : 1);

  const popular = dataArray.slice(0, 5);
  const popularAmount = popular.reduce((acc, item) => acc += item.eoseq, 0);

  return {
    popular: dataArray.slice(0, 5),
    total,
    otherAmount: total - popularAmount,
    eosUsd,
    all: dataArray
  };
}
