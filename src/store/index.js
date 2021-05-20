import { createStore } from "vuex";
import axios from "axios";

const login_url = "http://127.0.0.1:8000/api/token";
const register = "http://127.0.0.1:8000/api/register";
//const get_user_from_token = "http://127.0.0.1:8000/api/verify";

export default createStore({
  state: {
    isLoading: false,
    username: null,
    password: null,
    loggedIn: false,
  },
  mutations: {
    setLoadingStatus(state, isLoading) {
      state.isLoading = isLoading;
    },
    getUsername(state) {
      return state.username;
    },
    getPassword(state) {
      return state.password;
    },
    getLoggedIn(state) {
      return state.loggedIn;
    },
    setUsername(state, username) {
      state.username = username;
    },
    setPassword(state, password) {
      state.password = password;
    },
    setLoggedIn(state, loggedIn) {
      state.loggedIn = loggedIn;
    },
  },
  getters: {
    isLoading: (state) => state.isLoading,
    username: (state) => state.username,
    password: (state) => state.password,
  },
  actions: {
    login(context) {
      context.commit("setLoadingStatus", true);
      const params = new URLSearchParams();
      params.append("username", context.commit("getUsername"));
      params.append("password", context.commit("getPassword"));
      let config = {
        headers: {
          "content-type": "application/x-www-form-urlencoded;charset=utf-8",
          accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      };
      axios
        .post(login_url, params, config)
        .then((response) => {
          console.log(response.data.access_token);
          if (response.data.access_token !== undefined) {
            localStorage.setItem("token", response.data.access_token);
            context.commit("setPassword", "");
            context.commit("setLoggedIn", true);
          } else {
            console.log("Error logging in");
          }
          context.commit("setLoadingStatus", false);
        })
        .catch((err) => {
          console.error("Login Error: \n" + err);
          context.commit("setLoadingStatus", false);
          context.commit("setLoggedIn", false);
        });
    },
    register(context) {
      context.commit("setLoadingStatus", true);
      fetch(register, {
        method: "PUT",
        headers: {
          accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          username: context.commit("getUsername"),
          password: context.commit("getPassword"),
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          console.log(response);
          if (response.access_token !== undefined) {
            localStorage.setItem("token", response.access_token);
            context.commit("setLoadingStatus", false);
            context.commit("setLoggedIn", true);
          } else {
            console.error("Error during register");
            context.commit("setLoadingStatus", false);
          }
        })
        .catch((err) => {
          console.log(err);
          context.commit("setLoggedIn", false);
          context.commit("setLoadingStatus", false);
        });
    },
  },
});
