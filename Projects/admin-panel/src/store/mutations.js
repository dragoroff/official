export const setData = (state, payload) => {
  return (state.data = payload);
};

export const merchFilt = (state, payload) => {
  if (payload) {
    const merchData = state.data[1].merchants.filter(x => x.tag === payload);
    state.filteredMerchData = merchData;
  } else {
    for (let i in state.data[1].merchants) {
      const isSame = state.allMerchants.some(
        el => el.value === state.data[1].merchants[i].tag
      );
      if (!isSame) {
        state.allMerchants.push({
          text: state.data[1].merchants[i].tag,
          value: state.data[1].merchants[i].tag
        });
      }
    }
  }
};

export const currFilt = (state, payload) => {
  if (payload) {
    const totalCurrData = state.data[0].currencies[payload];
    const merchCurrData = state.data[1].merchants.map(x => {
      if (!x.currencies[payload]) {
        return;
      } else {
        return x.currencies[payload].balance;
      }
    });
    merchCurrData.unshift(totalCurrData.balance);
    state.currencyFiltMerch = merchCurrData;
  } else {
    throw new Error("Payload must be provided");
  }
};

export const initCurrData = state => {
  const settleCurrTotal = state.data[0].balance;
  const settleCurrMerch = state.data[1].merchants.map(x => {
    return x.balance;
  });
  settleCurrMerch.unshift(settleCurrTotal);
  state.currencyFiltMerch = settleCurrMerch;
  state.currencies = Object.keys(state.data[0].currencies);
};

export const clearCurrFilt = state => {
  return (state.currencyFiltMerch = []);
};

export const clearAllMerchants = state => {
  return (state.allMerchants = []);
};

export const clearMerchants = state => {
  return (state.filteredMerchData = []);
};

export const dateFilter = (state, payload) => {
  const date = state.data.map(x => new Date(x.date).getTime());
  console.log("STATE DATE", date);
  console.log("PAYLOAD DATE", payload);
  for (let day in date) {
    date[day] >= payload[0] && date[day] <= payload[1]
      ? console.log("true")
      : console.log("false");
  }
};
