export default function calculateBalance(balance, removedElements) {
  const popular = balance.popular.filter(item => removedElements.indexOf(item.key) === -1);
  const labels = popular.map(item => item.key);
  const eosData = popular.map(item => item.eoseq);
  const { otherAmount, eosUsd } = balance;
  let { total } = balance;
  if (removedElements.length > 0 ) {
    removedElements.forEach((item) => {
      const removedItem = balance.popular.find(balanceItem => balanceItem.key === item);
      if (removedItem) {
        total -= removedItem.eoseq;
      }
    });
  }

  if (removedElements.indexOf('Other Tokens') === -1) {
    labels.push('Other Tokens');
    eosData.push(otherAmount);
  }

  const walletData = eosData.reduce((acc, item) => {
    const percent = (item * 100 / total).toFixed(2);
    acc.push(percent);
    return acc;
  }, []);

  const activeElement = {
    index: 0,
    value: walletData[0],
    label: labels[0]
  };
  const totalUsd = (eosUsd * total).toFixed(2);
  return { labels, walletData, totalUsd, activeElement };
}
