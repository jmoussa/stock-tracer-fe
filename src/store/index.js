import { createStore } from "vuex";
import axios from "axios";

const login_url = "http://127.0.0.1:8000/api/token";
const register = "http://127.0.0.1:8000/api/register";
//const get_user_from_token = "http://127.0.0.1:8000/api/verify";

export default createStore({
  state: {
    status: "",
    token: localStorage.getItem("token") || "",
    user: {},
    isLoading: false,
    loggedIn: false,
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
    auth_error(state) {
      state.status = "error";
    },
    logout(state) {
      state.status = "";
      state.token = "";
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
    authStatus: (state) => state.status,
    isLoading: (state) => state.isLoading,
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
            console.log(resp.data);
            localStorage.setItem("token", token);
            axios.defaults.headers.common["Authorization"] = token;
            commit("auth_success", token, user);
            resolve(resp);
          })
          .catch((err) => {
            commit("auth_error");
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
            commit("auth_error");
            localStorage.removeItem("token");
            reject(err);
          });
      });
    },
  },
});
