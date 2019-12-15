export const getAllData = state => {
  return state.data;
};

export const getAllMerchants = state => {
  return state.allMerchants;
};

export const getCurrencyFilt = state => {
  return {
    currencies: state.currencies,
    currencyFilt: state.currencyFiltMerch
  };
};

export const getState = state => {
  return state;
};

export const getPageText = state => {
  return state.pageText;
};

export const getFilteredMerchData = state => {
  return state.filteredMerchData;
};
