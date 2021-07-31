import { createStore } from "vuex";
import axios from "axios";
//import { stackOffsetExpand } from "d3";

const login_url = "http://127.0.0.1:8000/api/token";
const register = "http://127.0.0.1:8000/api/register";
const robinhood_info = "http://127.0.0.1:8000/api/robinhood/info";

export default createStore({
  state: {
    portfolio_cards: {},
    historical_data: {},
    status: "",
    token: localStorage.getItem("token") || "",
    user: {},
    loggedIn: false,
    selectedTicker: null,
    selectedTickerInfo: {},
    show_mfa: false,
    display_error: false,
    transactions: null,
    error_message: "",
    account_profile: {},
    earnings: null,
    macd_data: null,
    dividends: null,
  },
  mutations: {
    auth_request(state) {
      state.status = "loading";
    },
    remove_loading(state) {
      state.status = "success";
    },
    auth_success(state, token, user) {
      state.status = "success";
      state.token = token;
      state.user = user;
    },
    auth_error(state, error) {
      state.status = "error";
      console.log(error);
      state.loggedIn = false;
    },
    logout(state) {
      state.status = "";
      state.token = "";
    },
    rh_request_success(state) {
      state.loggedIn = true;
      state.status = "success";
    },
    set_account_profile(state, _profile) {
      state.account_profile = _profile;
    },
    set_transactions(state, _transactions) {
      state.transactions = _transactions;
    },
    set_portfolio(state, _portfolio) {
      state.portfolio_cards = _portfolio;
    },
    set_historicals(state, _historicals) {
      state.historical_data = _historicals;
    },
    set_selected_ticker(state, _selectedTicker) {
      state.selectedTicker = _selectedTicker;
    },
    set_selected_ticker_info(state, _selectedTickerInfo) {
      state.selectedTickerInfo = _selectedTickerInfo;
    },
    set_show_mfa(state, _mfa_show) {
      state.show_mfa = _mfa_show;
    },
    display_error_message(state, _error_message) {
      state.display_error = true;
      state.error_message = _error_message;
    },
    remove_error_message(state) {
      state.display_error = false;
      state.error_message = "";
    },
    set_earnings(state, _earnings) {
      state.earnings = _earnings;
    },
    set_macd_data(state, _macd) {
      state.macd_data = _macd;
    },
    set_dividends(state, _dividends) {
      state.dividends = _dividends;
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
    status: (state) => state.status,
    commonLoggedIn: (state) => state.loggedIn,
    getAccountProfile: (state) => state.account_profile,
    getTransactions: (state) => state.transactions,
    getPortfolioCards: (state) => state.portfolio_cards,
    getSelectedTicker: (state) => state.selectedTicker,
    getSelectedTickerInfo: (state) => {
      if (state.selectedTickerInfo !== {}){
        return state.selectedTickerInfo
      }else{
        return state.portfolio[Object.keys(state.portfolio)[0]]
      }
    },
    getSelectedTickerHistoricalData: (state) => state.historical_data[state.selectedTicker],
    getShowMFA: (state) => state.show_mfa,
    getErrorMessage: (state) => state.error_message,
    isErrorDisplayed: (state) => state.display_error,
    getEarnings: (state) => state.earnings,
    getSelectedMACD: (state) => state.macd_data[state.selectedTicker],
    getDividends: (state) => state.dividends,
  },
  actions: {
    logout({ commit }) {
      return new Promise((resolve) => {
        commit("logout");
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        resolve();
      });
    },
    login({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit("auth_request");
        const params = new URLSearchParams();
        params.append("username", user.username);
        params.append("password", user.password);
        let config = {
          headers: {
            "content-type": "application/x-www-form-urlencoded;charset=utf-8",
            accept: "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        };
        axios
          .post(login_url, params, config)
          .then((resp) => {
            //Expects a JSON with 'token' and 'user' keys
            let token = resp.data.access_token;
            let user = resp.data.user;
            localStorage.setItem("token", token);
            axios.defaults.headers.common["Authorization"] = token;
            commit("auth_success", token, user);
            resolve(resp);
          })
          .catch((err) => {
            commit("auth_error", err);
            localStorage.removeItem("token");
            reject(err);
          });
      });
    },
    register({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit("auth_request");
        const params = new URLSearchParams();
        params.append("username", user.username);
        params.append("password", user.password);
        let config = {
          headers: {
            "content-type": "application/x-www-form-urlencoded;charset=utf-8",
            accept: "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        };
        axios
          .post(register, params, config)
          .then((resp) => {
            //Expects a JSON with 'token' and 'user' keys
            const token = resp.data.token;
            const user = resp.data.user;
            localStorage.setItem("token", token);
            axios.defaults.headers.common["Authorization"] = token;
            commit("auth_success", token, user);
            resolve(resp);
          })
          .catch((err) => {
            commit("auth_error", err);
            localStorage.removeItem("token");
            reject(err);
          });
      });
    },
    getRobinhoodInfo({ commit }, body) {
      return new Promise((resolve, reject) => {
        commit("auth_request");
        let token = localStorage.getItem("token");
        if (token != "" && token != undefined) {
          const instance = axios.create({
            timeout: 30000,
            headers: {
              "content-type": "application/json",
              accept: "application/json",
              "Access-Control-Allow-Origin": "*",
              Authorization: `Bearer ${token}`,
            },
          });
          instance
            .post(robinhood_info, body)
            .then((resp) => {
              let _response = resp.data;
              if (
                _response["message"] == undefined ||
                _response["message"] == null
              ) {
                commit("set_portfolio", _response["build_holdings"]);
                commit("set_historicals", _response["historicals"]);
                commit("set_transactions", _response["transactions"]);
                commit("set_account_profile", _response["account_profile"]);
                commit("set_earnings", _response["earnings"]);
                commit("set_macd_data", _response["macd_data"]);
                commit("set_dividends", _response["dividends"]);
                commit("rh_request_success");
                resolve(_response["build_holdings"]);
              } else {
                commit("remove_loading");
                resolve(false);
              }
            })
            .catch((err) => {
              commit("auth_error", err);
              localStorage.removeItem("token");
              reject(err);
            });
        } else {
          commit("auth_error", "No token found");
          localStorage.removeItem("token");
          reject("No token found");
        }
      });
    },
  },
});
