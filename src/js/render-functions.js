'use strict';

export default function renderGallery(images){
    return images.map(img => createGalleryItemMarkup(img)).join("");
}

function createGalleryItemMarkup({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) {
    let galleryItemMarkup = `<li class="gallery-item">
                <a class="gallery-image-link" href="${largeImageURL}">
                    <img 
                        class="gallery-image" 
                        src="${webformatURL}" 
                        alt="${tags}" 
                    />
                </a>
                <ul class="gallery-item-stats">`;
    
    for (const [key, value] of Object.entries({ likes, views, comments, downloads })) {
        galleryItemMarkup += `<li class="gallery-item-stats-item">
                                <p class="gallery-item-stats-label">${key}</p>
                                <p class="gallery-item-stats-value">${value}</p>
                              </li>`;
    }
    
    return galleryItemMarkup += '</ul></li>';
}
