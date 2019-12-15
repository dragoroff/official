export const sendData = ({ commit }, payload) => {
  commit("setData", payload);
};

export const filterMerch = ({ commit }, payload) => {
  if (payload) {
    commit("merchFilt", payload);
  } else {
    commit("merchFilt");
  }
};

export const currFilt = ({ commit }, payload) => {
  commit("currFilt", payload);
};

export const initCurrData = ({ commit }) => {
  commit("initCurrData");
};

export const clearCurrFilt = ({ commit }) => {
  commit("clearCurrFilt");
};

export const clearAllMerchants = ({ commit }) => {
  commit("clearAllMerchants");
};

export const clearMerchants = ({ commit }) => {
  commit("clearMerchants");
};
