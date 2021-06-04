import { createStore } from "vuex";
import axios from "axios";

const login_url = "http://127.0.0.1:8000/api/token";
const register = "http://127.0.0.1:8000/api/register";
const rh_portfolio = "http://127.0.0.1:8000/api/rh_portfolio";
const rh_historical = "http://127.0.0.1:8000/api/rh_historical";

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
  },
  mutations: {
    auth_request(state) {
      state.status = "loading";
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
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
    status: (state) => state.status,
    commonLoggedIn: (state) => state.loggedIn,
    getPortfolioCards: (state) => state.portfolio_cards,
    getSelectedTicker: (state) => state.selectedTicker,
    getSelectedTickerInfo: (state) => state.selectedTickerInfo,
    getSelectedTickerHistoricalData: (state) =>
      state.historical_data[state.selectedTicker],
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
    rhGetPortfolio({ commit }) {
      return new Promise((resolve, reject) => {
        commit("auth_request");
        //const body = {
        //username: user.username,
        //password: user.password,
        //};
        let token = localStorage.getItem("token");
        if (token != "" && token != undefined) {
          const instance = axios.create({
            timeout: 10000,
            headers: {
              "Access-Control-Allow-Origin": "*",
              Authorization: `Bearer ${token}`,
            },
          });
          instance
            .get(rh_portfolio)
            .then((resp) => {
              let portfolio_response = resp.data;
              commit("set_portfolio", portfolio_response);
              commit("rh_request_success");
              resolve(portfolio_response);
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
    rhGetHistoricals({ commit }) {
      return new Promise((resolve, reject) => {
        commit("auth_request");
        let token = localStorage.getItem("token");
        if (token != "" && token != undefined) {
          const instance = axios.create({
            timeout: 10000,
            headers: {
              "Access-Control-Allow-Origin": "*",
              Authorization: `Bearer ${token}`,
            },
          });
          instance
            .get(rh_historical)
            .then((resp) => {
              let portfolio_response = resp.data;
              commit("set_historicals", portfolio_response);
              commit("rh_request_success");
              resolve(portfolio_response);
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
