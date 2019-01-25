
export default {
    state: {
        credentials: null
    },
    mutations: {
        // call commit for mutations
        getUser(state, data) {
            state.credentials = null;
            if (data.data.length > 0) {
                state.credentials = {
                    id: data.data[0][0],
                    username: data.data[0][1],
                    password: data.data[0][2],
                    server: data.data[0][3],
                }
            }
        },
        loginUser(state, data) {
            state.credentials = data.data;
        },
    },
    getters: {
        isLoggedIn(state, getters, rootState) {
            return !! state.credentials;
        },
        getServerUrl(state, getters, rootState) {
            return state.credentials.server;
        }
    },
    actions: {
        login({state, commit, rootState}, data) {
            rootState.database.execSQL("INSERT INTO user (username, password, server) VALUES (?, ?, ?)", Object.values(data)).then(id => {
                commit("loginUser", { data: data });
            }, error => {
                console.log("DB: Insert error - ", error);
            });
        },
        getLoggedInUser({state, commit, rootState}) {
            return new Promise((resolve, reject) => {
                rootState.database.all("SELECT * FROM user", []).then(result => {
                    commit("getUser", { data: result });
                    resolve({ data: result });
                }, error => {
                    console.log("DB: Select error - ", error);
                    reject(error);
                });
            });
        },
        logout({state, commit, rootState}) {
            rootState.database.all("DELETE FROM user", []).then(result => {
                commit("loginUser", { data: null });
            }, error => {
                console.log("DB: Select error - ", error);
            });
        }
    }
}