'use strict';

import PixabayAPI from './js/pixabay-api.js';
import iziToast from 'izitoast';
import errorIcon from '/img/error-icon.png';
import renderGallery from './js/render-functions.js';
import SimpleLightbox from 'simplelightbox';

const PIXABAY_API_KEY = '25546966-f3ef2260a4c78c9f4c7cc9e45';
const SEARCH_IMAGES_REQUEST_OPTIONS = {
    'image_type': 'photo',
    'orientation': 'horizontal',
    'safesearch': true
};
const PER_PAGE = 15;
const FIRST_PAGE = 1;

const pixabayApi = new PixabayAPI(PIXABAY_API_KEY);
const gallerySlider = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  captionsPosition: 'bottom',
});

const searchForm = document.querySelector('#search-form');
const galleryContainer = document.querySelector('.gallery');
const loaderElement = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-more-btn');

let paginatonParams = {
    'page': FIRST_PAGE,
    'per_page': PER_PAGE
}

// the last search query text 
let searchQueryText;
let totalPages = null;

function prepareNewSearch(newSearchQueryText) {
    galleryContainer.innerHTML = '';
    paginatonParams.page = FIRST_PAGE;
    searchQueryText = newSearchQueryText;
    totalPages = null;
}

function scrollGallery() {
    const galleryItem = document.querySelector('.gallery-item');
    const rect = galleryItem.getBoundingClientRect();
    window.scrollBy({ behavior: 'smooth', top: (rect.height + 48) * 2 });
}

loadMoreBtn.addEventListener('click', (event) => {
    resolveImageSearching();
});


searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const newSearchQueryText = event.currentTarget.searchField.value.trim();

    if (newSearchQueryText === '') {
        showErrorMessage('You have to write something!');
        return;
    }

    // is this the new search query? - prepare for it
    if (newSearchQueryText !== searchQueryText) {
        prepareNewSearch(newSearchQueryText);
    } 

    resolveImageSearching();
});

async function resolveImageSearching() {

    hideLoadMoreBtn();
    showLoader();

    let imagesResponse;

    try {
        imagesResponse = await pixabayApi.searchImages({
            ...{ 'q': searchQueryText },
            ...paginatonParams,
            ...SEARCH_IMAGES_REQUEST_OPTIONS
        });
    } catch (error) {
        showErrorMessage(error.message);
    } finally {
        hideLoader();
        searchForm.reset();
    }
    
    if(imagesResponse.totalHits === 0){
        showErrorMessage('Sorry, there are no images matching your search query. Please try again!');
        return;
    }

    galleryContainer.insertAdjacentHTML('beforeend', renderGallery(imagesResponse.hits));
    gallerySlider.refresh();

    if (paginatonParams.page !== 1) {
        scrollGallery();
    }
    
    // null for totalPages means it's the first request with new search query
    if (totalPages === null) {
        totalPages = Math.ceil(imagesResponse.totalHits / PER_PAGE);
    }

    // if next page number will be more then total pages at all - show message and do not show load more button
    if (++paginatonParams.page > totalPages) {
        showInfoMessage('We\'re sorry, but you\'ve reached the end of search results.');
    } else {
        showLoadMoreBtn();
    }
}


function showErrorMessage(msgText) {
    iziToast.error({
        title: 'Error',
        message: msgText,
        iconUrl: errorIcon,
        position: 'topRight',
        titleColor: '#FFF',
        messageColor: '#FFF',
        backgroundColor: '#EF4040',
        theme: 'dark',
        progressBar: false,
        close: false,
    });
}

function showInfoMessage(msgText){
    iziToast.info({
        title: 'Info',
        message: msgText,
        position: 'topRight',
        titleColor: '#FFF',
        messageColor: '#FFF',
        theme: 'dark',
        progressBar: false,
        close: false,
    });
}

function showLoader() {
    loaderElement.classList.remove('hidden');
}

function hideLoader() {
    loaderElement.classList.add('hidden');
}

function showLoadMoreBtn() {
    loadMoreBtn.classList.remove('hidden');
}

function hideLoadMoreBtn() {
    loadMoreBtn.classList.add('hidden');
}