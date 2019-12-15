export const defaultText = {
  computed: {
    pageText() {
      return this.$store.getters.getPageText;
    },
    getState() {
      return this.$store.getters.getState;
    },
    allData() {
      return this.$store.getters.getAllData;
    }
  }
};

export const filterMerchants = {
  computed: {
    allMerchants() {
      return this.$store.getters.getAllMerchants;
    }
  },
  methods: {
    getMerchant(merch) {
      this.$store.dispatch("filterMerch", merch);
      this.fetchMerchData();
    },
    assigningData(balance, reserve, turnover) {
      this.balance = balance;
      this.reserve = reserve;
      this.turnover = turnover;
    },
    fetchMerchData() {
      this.data = this.$store.getters.getFilteredMerchData;
      let { balance, reserve, turnover } = this.data[0];
      this.assigningData(balance, reserve, turnover);
    },
    getTableData() {
      let { balance, reserve, turnover } = this.allData[0];
      this.data = this.allData[1].merchants;
      this.assigningData(balance, reserve, turnover);
    }
  },
  created() {
    this.$store.dispatch("clearAllMerchants");
    this.$store.dispatch("filterMerch");
  }
};
