import axios from "axios";
import MovieDatabase from "../../services/the-movie-database";

const movieDb = new MovieDatabase();
const ptn = require('parse-torrent-name');

export default {
    state: {
        items: []
    },
    mutations: {
        // call commit for mutations
        loadHistory(state, data) {
            state.items = [];
            for(let i = 0; i < data.data.length; i++) {
                state.items.push({
                    id: data.data[i][0],
                    flexget_id: data.data[i][1],
                    task: data.data[i][2],
                    details: data.data[i][3],
                    dl_time: data.data[i][4],
                    title: data.data[i][5],
                    season: data.data[i][6],
                    episode: data.data[i][7],
                    parsed_title: data.data[i][8],
                    dl_year: data.data[i][9],
                    quality: data.data[i][10],
                    dl_group: data.data[i][11],
                    resolution: data.data[i][12],
                    codec: data.data[i][13],
                    tmdb_id: data.data[i][14],
                    backdrop_url: data.data[i][15],
                    poster_url: data.data[i][16],
                    media_type: data.data[i][17],
                    overview: data.data[i][18],
                    popularity: data.data[i][19],
                    vote_average: data.data[i][20],
                    vote_count: data.data[i][21],
                    release_date: data.data[i][22]
                });
            }
        },
        saveHistory(state, data) {
            state.items.push({
                flexget_id: data.data.flexget_id,
                task: data.data.task,
                details: data.data.details,
                dl_time: data.data.dl_time,
                title: data.data.title,
                season: data.data.season,
                episode: data.data.episode,
                parsed_title: data.data.parsed_title,
                dl_year: data.data.dl_year,
                quality: data.data.quality,
                dl_group: data.data.dl_group,
                resolution: data.data.resolution,
                codec: data.data.codec,
                tmdb_id: data.data.tmdb_id,
                backdrop_url: data.data.backdrop_url,
                poster_url: data.data.poster_url,
                media_type: data.data.media_type,
                overview: data.data.overview,
                popularity: data.data.popularity,
                vote_average: data.data.vote_average,
                vote_count: data.data.vote_count,
                release_date: data.data.release_date,
            });
        },
    },
    getters: {
        allHistory(state) {
            return state.items;
        },
        mostPopularRecently(state, getters, rootState) {
            let items = getters.latestDownloads.slice(0);
            items.sort((a, b) => {
                return b.vote_average - a.vote_average;
            });
            return items.length > 0 ? items[0] : null;
        },
        latestDownloads(state, getters, rootState) {
            state.items.sort((a,b) => {
                return b.flexget_id - a.flexget_id;
            });
            return state.items.slice(0, 20);
        },
        popularContent(state, getters, rootState) {
            return state.items.filter(item => item.popularity > 10);
        }
    },
    actions: {
        getHistory({state, dispatch, getters, rootState}, page) {
            return new Promise((resolve, reject) => {
                let api = getters.getServerUrl,
                    pagination = (typeof(page) === "undefined") ? 1 : page,
                    perPage = (typeof(page) === "undefined") ? 20 : 10;
                axios.get(api+"/history", {
                    params: {
                        per_page: perPage,
                        page: pagination,
                    }
                }).then((response) => {
                    console.log("Got "+response.data.length+ " history items");
                    if(!response.data) return resolve(false);
                    response.data.forEach(item => {
                        // check if item already exists in our db
                        const historyItem = state.items.find(entry => entry.flexget_id === item.id);
                        if (historyItem) return;
                        // if new add to db
                        const meta = ptn(item.title);
                        let download = {
                            flexget_id: item.id,
                            task: item.task,
                            details: item.details,
                            dl_time: item.time,
                            title: item.title,
                            season: meta.season,
                            episode: meta.episode,
                            parsed_title: meta.title,
                            dl_year: meta.year,
                            quality: meta.quality,
                            dl_group: meta.group,
                            resolution: meta.resolution,
                            codec: meta.codec,
                            tmdb_id: null,
                            backdrop_url: null,
                            poster_url: null,
                            media_type: null,
                            overview: null,
                            popularity: null,
                            vote_average: null,
                            vote_count: null,
                            release_date: null,
                        };
                        movieDb
                            .search("multi", {
                                query: meta.title,
                            })
                            .then(response => {
                                if(response.data.results.length > 0) {
                                    let data = response.data.results[0];
                                    download.tmdb_id = data.id;
                                    download.backdrop_url = "https://image.tmdb.org/t/p/w500"+data.backdrop_path;
                                    download.poster_url = "https://image.tmdb.org/t/p/w200"+data.poster_path;
                                    download.media_type = data.media_type;
                                    download.overview = data.overview;
                                    download.popularity = data.popularity;
                                    download.vote_average = data.vote_average;
                                    download.vote_count = data.vote_count;
                                    download.release_date = data.release_date ? data.release_date : data.first_air_date;
                                }
                                dispatch("insertHistory", download);
                            })
                            .catch(error => {
                                console.log("tMDB multi search: "+error);
                                // insert it without the movieDb data, perhaps we will try again later?
                                // dispatch("insertHistory", download);
                            });
                    });
                    resolve(true);
                }).catch((error) => {
                    console.log("Flexget history: "+error);
                    reject(error);
                });
            });
        },
        insertHistory({state, commit, rootState}, data) {
            rootState.database.execSQL("INSERT INTO history (flexget_id, task, details, dl_time, title, season, episode, parsed_title, dl_year, quality, dl_group, resolution, codec, tmdb_id, backdrop_url, poster_url, media_type, overview, popularity, vote_average, vote_count, release_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", Object.values(data)).then(id => {
                commit("saveHistory", { data: data });
            }, error => {
                console.log("DB: Insert error - ", error);
            });
        },
        queryHistory({state, commit, dispatch, rootState}) {
            rootState.database.all("SELECT * FROM history ORDER BY dl_time DESC", []).then(result => {
                commit("loadHistory", { data: result });
            }, error => {
                console.log("DB: Select error - ", error);
            });
        }
    }
}