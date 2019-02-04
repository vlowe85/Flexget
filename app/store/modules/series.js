import axios from "axios";
import MovieDatabase from "../../services/the-movie-database";

const movieDb = new MovieDatabase();
const moment = require('moment');

export default {
    state: {
        series: null
    },
    mutations: {
        loadSeriesList(state, data) {
            state.series = [];
            for(let i = 0; i < data.data.length; i++) {
                state.series.push({
                    id: data.data[i][0],
                    name: data.data[i][1],
                    tmdb_id: data.data[i][2],
                    poster_url: data.data[i][3],
                    backdrop_url: data.data[i][4],
                    last_air_date: data.data[i][5],
                    next_air_date: data.data[i][6],
                    next_season_number: data.data[i][7],
                    next_episode_number: data.data[i][8],
                    next_episode_name: data.data[i][9]
                });
            }
        },
        saveSeries(state, data) {
            state.series.push({
                name: data.data.name,
                tmdb_id: data.data.tmdb_id,
                poster_url: data.data.poster_url,
                backdrop_url: data.data.backdrop_url,
                last_air_date: data.data.last_air_date,
                next_air_date: data.data.next_air_date,
                next_season_number: data.data.season,
                next_episode_number: data.data.next_episode_number,
                next_episode_name: data.data.next_episode_name
            });
        },
        updateSeriesItem(state, data) {
            let item = state.series.find(element => element.tmdb_id === data.tmdb_id);
            item.last_air_date = data.data.last_air_date;
            item.next_air_date = data.data.next_air_date;
            item.next_season_number = data.data.next_season_number;
            item.next_episode_number = data.data.next_episode_number;
            item.next_episode_name = data.data.next_episode_name;
        },
    },
    getters: {
        allSeries(state) {
            return state.series;
        },
        upcomingEpisodes(state) {
            let series = state.series.filter(item => item.next_air_date !== null);
            series.sort(function (a, b) {
                return moment(a.next_air_date, "YYYY-MM-DD").diff(moment(b.next_air_date, "YYYY-MM-DD"))
            });
            return series;
        },
    },
    actions: {
        getSeriesList({state, dispatch, getters, rootState}, page) {
            return new Promise((resolve, reject) => {
                let api = getters.getServerUrl;
                axios.get(api+"/series", {
                    params: {
                        per_page: 50,
                    }
                }).then((response) => {
                    console.log("Got "+response.data.length+ " series items");
                    if(!response.data) return resolve(false);
                    response.data.forEach(item => {
                        // check if item already exists in our db
                        const seriesItem = state.series.find(entry => entry.name === item.name);
                        if (seriesItem) return;
                        // if new add to db
                        movieDb
                            .search("multi", {
                                query: item.name,
                            })
                            .then(response => {
                                if(response.data.results.length > 0) {
                                    let data = response.data.results[0];
                                    let series = {
                                        name: item.name,
                                        tmdb_id: data.id,
                                        poster_url: "https://image.tmdb.org/t/p/w200"+data.poster_path,
                                        backdrop_url: "https://image.tmdb.org/t/p/w500"+data.backdrop_path,
                                    };
                                    movieDb
                                        .details("tv", data.id)
                                        .then(response2 => {
                                            let details = response2.data,
                                                upcomingEpisode = details.hasOwnProperty("next_episode_to_air") ? details.next_episode_to_air : null;
                                            series.last_air_date = details.last_air_date;
                                            series.next_air_date = upcomingEpisode ? upcomingEpisode.air_date : null;
                                            series.next_season_number = upcomingEpisode && upcomingEpisode.hasOwnProperty("season_number") ? upcomingEpisode.season_number : null;
                                            series.next_episode_number = upcomingEpisode && upcomingEpisode.hasOwnProperty("episode_number") ? upcomingEpisode.episode_number : null;
                                            series.next_episode_name = upcomingEpisode && upcomingEpisode.hasOwnProperty("name") ? upcomingEpisode.name : null;
                                            dispatch("insertSeries", series);
                                        })
                                        .catch(error => {
                                            console.log("tMDB multi details: "+error);
                                        });
                                }
                            })
                            .catch(error => {
                                console.log("tMDB multi search: "+error);
                                // insert it without the movieDb data, perhaps we will try again later?
                                // dispatch("insertHistory", download);
                            });
                    });
                    resolve(true);
                }).catch((error) => {
                    console.log("Flexget series: "+error);
                    reject(error);
                });
            });
        },
        updateSeriesList({state, dispatch, getters, rootState}) {
            return new Promise((resolve, reject) => {
                let items = getters.allSeries;
                console.log("Got " + items.length + " series to update");
                items.forEach(item => {
                    movieDb
                        .details("tv", item.tmdb_id)
                        .then(response => {
                            let details = response.data,
                                upcomingEpisode = details.hasOwnProperty("next_episode_to_air") ? details.next_episode_to_air : null,
                                series = {};
                            series.last_air_date = details.last_air_date;
                            series.next_air_date = upcomingEpisode ? upcomingEpisode.air_date : null;
                            series.next_season_number = upcomingEpisode && upcomingEpisode.hasOwnProperty("season_number") ? upcomingEpisode.season_number : null;
                            series.next_episode_number = upcomingEpisode && upcomingEpisode.hasOwnProperty("episode_number") ? upcomingEpisode.episode_number : null;
                            series.next_episode_name = upcomingEpisode && upcomingEpisode.hasOwnProperty("name") ? upcomingEpisode.name : null;
                            dispatch("updateSeries", series);
                        })
                        .catch(error => {
                            console.log("tMDB multi details: "+error);
                        });
                });
            });
        },
        insertSeries({state, commit, rootState}, data) {
            rootState.database.execSQL("INSERT INTO series (name, tmdb_id, poster_url, backdrop_url, last_air_date, next_air_date, next_season_number, next_episode_number, next_episode_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", Object.values(data)).then(id => {
                commit("saveSeries", { data: data });
            }, error => {
                console.log("DB: Insert error - ", error);
            });
        },
        querySeries({state, commit, dispatch, rootState}) {
            rootState.database.all("SELECT * FROM series ORDER BY name", []).then(result => {
                commit("loadSeriesList", { data: result });
            }, error => {
                console.log("DB: Select error - ", error);
            });
        },
        updateSeries({state, commit, rootState}, data) {
            rootState.database.execSQL("UPDATE series SET last_air_date = ?, next_air_date = ?, next_season_number = ?, next_episode_number = ?, next_episode_name= ? WHERE tmdb_id = ?", Object.values(data)).then(id => {
                commit("updateSeriesItem", { data: data });
            }, error => {
                console.log("DB: Update error - ", error);
            });
        },
    }
}