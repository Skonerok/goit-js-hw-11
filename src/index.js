import { fetchImages } from "../src/js/fetchImages";
import './css/styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import 'simplelightbox/dist/simple-lightbox.min.css';

const formRef = document.querySelector('.search-form');
const galleryRef = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let page = 1;
let perPage = 40;
let searchQuery = '';

const lightbox = new SimpleLightbox('.gallery a', {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
});

formRef.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

function onFormSubmit(e) {
    e.preventDefault();
    searchQuery = e.currentTarget.searchQuery.value.trim();
    galleryRef.innerHTML = '';
    loadMoreBtn.classList.add('is-hidden');

    if (searchQuery === '') {
        Notiflix.Notify.warning('Field cannot be empty');
        return;
    }

    fetchImages(searchQuery, page, perPage).then(({ data }) => {
        if (data.totalHits === 0) {
            Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        } else {
            createGallery(data.hits);
            Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
            lightbox.refresh();
            if (data.totalHits > perPage) {
                loadMoreBtn.classList.remove('is-hidden');
            }
        }
    }).catch(error => console.log(error));
}

function createGallery(images) {
    const markup = images.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `
        <a href="${largeImageURL}">
        <div class="photo-card">
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
</div>
</a>
        `
    }).join('');

    galleryRef.insertAdjacentHTML('beforeend', markup);
};

function onLoadMoreBtnClick() {
    page += 1;

    fetchImages(searchQuery, page, perPage).then(({ data }) => {
        createGallery(data.hits);

        const totalPages = Math.ceil(data.totalHits / perPage);

        if (page > totalPages) {
            loadMoreBtn.classList.add('is-hidden');
            Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
        }
    }).catch(error => console.log(error));
}
