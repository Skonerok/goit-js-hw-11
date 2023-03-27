import fetchImages from "./fetchImages";
// import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";

const formRef = document.querySelector('.search-form');
const galleryRef = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const ligthbox = new SimpleLightbox('.gallery a');

showLoadBtn = () => { loadMoreBtn.style.display = 'none' };
hideLoadBtn = () => { loadMoreBtn.style.display = 'block' };
hideLoadBtn();

formRef.addEventListener('submit', onFormInput);
loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);


async function onFormInput(evt) {
    evt.preventDefault();

    const searchQuery = evt.currentTarget.elements.searchQuery.value.trim();
    page = 1;
    
    if (searchQuery === '') {
        hideLoadBtn();
        cleanGalleryData();
        return;
    }

try {
    const galleryImages = await fetchImages(searchQuery);
    const totalPages = galleryImages.data.totalHits;
    if (galleryImages.data.hits.length === 0) {
        cleanGalleryData();
        console.error('Sorry, there are no images matching your search query. Please try again.');
    } else if (totalPages >= 40) {
        showLoadBtn();
        renderGallery(galleryImages.data.hits);
    }
} catch (error) {
    // console.error('Sorry, there are no images matching your search query. Please try again.');
}
};
function createGallery(images) {
    return images.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `
        <div class="photo-card">
        <a href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
  </a>
</div>
        `
    }).join('');
};

function renderGallery(images) {
    galleryRef.insertAdjacentHTML('beforeend', createGallery(images));
};

async function onLoadMoreBtnClick(evt) {
    page += 1;
    const searchQuery = evt.currentTarget.elements.searchQuery.value.trim();
   
    try {
        const galleryImages = await fetchImages(searchQuery);
        const totalPages = galleryImages.data.totalHits / perPage;
        if (totalPages <= page) {
            hideLoadBtn();
            console.log("We're sorry, but you've reached the end of search results.");
        }
        renderGallery(galleryImages.data.hits);
    } catch (error) {
        // console.error('Sorry, there are no images matching your search query. Please try again.');
    }
}

function cleanGalleryData() {
    galleryRef.innerHTML = '';
    page = 1;
    hideLoadBtn();
};