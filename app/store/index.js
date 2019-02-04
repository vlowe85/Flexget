import Vuex from 'vuex';
import Vue from 'nativescript-vue';

// Import vuex modules
import user from './modules/user';
import series from './modules/series';
import history from './modules/history';

const Sqlite = require('nativescript-sqlite');
Vue.config.devtools = true;
Vue.use(Vuex);

const dbName = "flexget.db";

const store = new Vuex.Store({
    modules: {
        user,
        series,
        history,
    },
    state: {
        database: null
    },
    mutations: {
        // call commit for mutations
        init(state, data) {
            state.database = data.database;
        }
    },
    getters: {

    },
    actions: {
        // call dispatch for actions
        init({commit, dispatch}) {
            // if(Sqlite.exists(dbName)) {
            //     Sqlite.deleteDatabase(dbName);
            //     console.log("DB: Delete - "+dbName );
            // }
            new Sqlite(dbName, (err, db) => {
                if (err) {
                    console.log(err);
                } else {
                    // get DB versin
                    db.version((err, ver) => {
                        console.log("DB: Version - "+ver);
                    });
                    commit("init", { database: db });

                    // create tables
                    db.execSQL("CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, server TEXT)").then(id => {
                        // console.log("DB: User table created");
                        dispatch('getLoggedInUser');
                    }, error => {
                        console.log("DB: Create table error - ", error);
                    });
                    db.execSQL("CREATE TABLE IF NOT EXISTS history (id INTEGER PRIMARY KEY AUTOINCREMENT, flexget_id INTEGER UNIQUE, task TEXT, details TEXT, dl_time TEXT, title TEXT, season TEXT, episode TEXT, parsed_title TEXT,dl_year TEXT, quality TEXT, dl_group TEXT, resolution TEXT, codec TEXT, tmdb_id INTEGER, backdrop_url TEXT, poster_url TEXT, media_type TEXT, overview TEXT, popularity TEXT, vote_average TEXT, vote_count TEXT, release_date TEXT)").then(id => {
                        // console.log("DB: History table created");
                        dispatch('queryHistory');
                    }, error => {
                        console.log("DB: Create table error - ", error);
                    });
                    db.execSQL("CREATE TABLE IF NOT EXISTS series (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, tmdb_id INTEGER, poster_url TEXT, backdrop_url TEXT, last_air_date TEXT, next_air_date TEXT, next_season_number INTEGER, next_episode_number INTEGER, next_episode_name TEXT)").then(id => {
                        // console.log("DB: Series table created");
                        dispatch('querySeries');
                    }, error => {
                        console.log("DB: Create table error - ", error);
                    });
                }
            });
        }
    }
});

store.dispatch("init");

export default store;