export const state = {
  data: [
    {
      balance: 10000,
      reserve: 2000000,
      turnover: 2240400,
      paid: 123309,
      open: 80210,
      currencies: {
        dollars: {
          balance: 10000
        },
        euros: {
          balance: 8000
        },
        yens: {
          balance: 62000
        },
        yuans: {
          balance: 63033
        }
      }
    },
    {
      merchants: [
        {
          date: "2018-10-06",
          name: "Tom",
          address: "No. 189, Grove St, Los Angeles",
          tag: "Merchant1",
          balance: 3000,
          reserve: 5000,
          turnover: 120000,
          currencies: {
            dollars: {
              balance: 3000
            },
            euros: {
              balance: 2800
            },
            yens: {
              balance: 32000
            },
            yuans: {
              balance: 23033
            }
          }
        },
        {
          date: "2018-10-02",
          name: "Tim",
          address: "No. 189, Grove St, Los Angeles",
          tag: "Merchant2",
          balance: 4000,
          reserve: 12000,
          turnover: 20000,
          currencies: {
            dollars: {
              balance: 4000
            },
            euros: {
              balance: 3800
            },
            yens: {
              balance: 42000
            },
            yuans: {
              balance: 33033
            }
          }
        },
        {
          date: "2018-10-04",
          name: "Bob",
          address: "No. 189, Grove St, Los Angeles",
          tag: "Merchant1",
          balance: 2000,
          reserve: 12000,
          turnover: 20000,
          currencies: {
            dollars: {
              balance: 4000
            },
            euros: {
              balance: 3800
            },
            yens: {
              balance: 42000
            },
            yuans: {
              balance: 33033
            }
          }
        },
        {
          date: "2018-10-01",
          name: "Alice",
          address: "No. 189, Grove St, Los Angeles",
          tag: "Merchant3",
          balance: 14000,
          reserve: 122000,
          turnover: 320000,
          currencies: {
            dollars: {
              balance: 13000
            },
            euros: {
              balance: 12800
            },
            yens: {
              balance: 132000
            },
            yuans: {
              balance: 123033
            }
          }
        },
        {
          date: "2018-10-07",
          name: "Francuas",
          address: "No. 189, Grove St, Los Angeles",
          tag: "Merchant2",
          balance: 14000,
          reserve: 122000,
          turnover: 320000,
          currencies: {
            dollars: {
              balance: 23000
            },
            euros: {
              balance: 22800
            },
            yens: {
              balance: 232000
            },
            yuans: {
              balance: 223033
            }
          }
        },
        {
          date: "2018-10-08",
          name: "Frederic",
          address: "No. 189, Grove St, Los Angeles",
          tag: "Merchant2",
          balance: 14000,
          reserve: 122000,
          turnover: 320000,
          currencies: {
            dollars: {
              balance: 4000
            },
            euros: {
              balance: 3800
            },
            yens: {
              balance: 42000
            },
            yuans: {
              balance: 33033
            }
          }
        },
        {
          date: "2018-10-09",
          name: "Patrick",
          address: "No. 189, Grove St, Los Angeles",
          tag: "Merchant3",
          balance: 14000,
          reserve: 122000,
          turnover: 320000,
          currencies: {
            dollars: {
              balance: 4000
            },
            euros: {
              balance: 3800
            },
            yens: {
              balance: 42000
            },
            yuans: {
              balance: 33033
            }
          }
        },
        {
          date: "2018-09-30",
          name: "Patrick",
          address: "No. 189, Grove St, Los Angeles",
          tag: "Merchant1",
          balance: 14000,
          reserve: 122000,
          turnover: 320000,
          currencies: {
            dollars: {
              balance: 4000
            },
            euros: {
              balance: 3800
            },
            yens: {
              balance: 42000
            }
            // yuans: {
            //   balance: 33033
            // }
          }
        }
      ]
    }
  ],
  allMerchants: [],
  filterDate: [],
  filteredMerchData: [],
  currencyFiltMerch: [],
  currencies: [],
  pageText: {
    balance: "Balance",
    titleForGraph: "Balance Per Currency",
    titleForSecGraph: "Balance in Settlement Currency",
    button: {
      logout: "Logout",
      lastWeek: "Last Week",
      thisWeek: "This Week",
      custom: "Custom Date",
      submit: "Submit"
    },
    history: "Settlement History",
    settlementCur: "Settlement Currency",
    chooseCur: "Choose Currency",
    dashboard: "Dashboard",
    transactions: "Transactions",
    turnover: "Turnover",
    declined: "Declined",
    chargebacks: "Chargebacks",
    frauds: "Frauds",
    reversals: "Reversals",
    disputes: "Disputes",
    reserve: "Rolling Reserve",
    infoHistory: "Pressing this button open settlement history page",
    merchants: "Merchants",
    summary: "Totals Summary",
    email: "Email",
    password: "Password",
    all: "All"
  },
  company: "Company Name",
  balance: 100000,
  username: "User",
  currency: {
    dollar: "$"
  }
};
