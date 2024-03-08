'use strict';

import axios from "axios";

const PIXABAY_API_URL = 'https://pixabay.com/api/';

export default class PixabayAPI {    
    #httpClient;
    constructor(apiKey) {
        this.#httpClient = axios.create({
            baseURL: PIXABAY_API_URL,
            params: {
                key: apiKey
            }    
        });
    }

    searchImages(urlParams) {
        return this.#fetch('', urlParams);
    }

    // searchVideos(urlParams) {
    //     return this.#fetch('videos/', urlParams);
    // }

    async #fetch(resourcePath, urlParams) {
        const response = await this.#httpClient.get(resourcePath, { params: urlParams });
        return response.data;
    }
}