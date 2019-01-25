import axios from "axios";

export default class MovieDatabase {

    constructor() {
        this.baseUrl = "https://api.themoviedb.org/3/";
        this.apiKey = "bee371b93caa74e0fc9c0d0e4143f896";
    }

    search(type, params) {
        params.api_key = this.apiKey;
        return axios.get(this.baseUrl+"search/"+type, {
            params: params
        });
    }

    details(type, id) {
        return axios.get(this.baseUrl+type+"/"+id, {
            params: {
                api_key: this.apiKey,
                append_to_response: "credits"
            }
        });
    }

    episode(id, season, episode) {
        return axios.get(this.baseUrl+"tv/"+id+"/season/"+season+"/episode/"+episode, {
            params: {
                api_key: this.apiKey
            }
        });
    }

    logout() {
        // no api call needed
    }
}
