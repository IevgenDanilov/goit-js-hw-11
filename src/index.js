import './sass/main.scss';
import axios from 'axios';
import Notiflix from 'notiflix';
import { getGalleryItemMarkup } from './js/itemMarkup';

// створення об'єкту посилань
export const refs = {
  searchForm: document.querySelector ('#search-form'),
  searchQuery: document.querySelector ('[name="searchQuery"]'),
  submitBtn: document.querySelector ('[type="submit"]'),
  gallery: document.querySelector ('.gallery'),
  loadMoreBtn: document.querySelector ('.load-more'),
  body: document.body,
};

let page = 1;

// Оголошення функції очищення вмісту сторінки
function clearPage () {
  refs.gallery.innerHTML = '';
}


// Оголошення функції отримання зображень з серверу

async function getImages(query) {
  try {
    const hitsData = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '23381165-23963a51c09328db6c17876e7',
        q: `${query}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page,
        per_page: 40,
      },
    });

    return hitsData;
    
  }
  catch (error) { console.error(error); }
}

// Оголошення функції рендеру

async function renderGallery(imageTag) {


  // Відправляємо запит на сервер
    
  const hitsData = await getImages(imageTag);
  const images = hitsData.data.hits;
  const totalHits = hitsData.data.totalHits;

  // Якщо знайдено хоча б один задовільний об'єкт створюємо розмітку
  if (images.length >= 1) {
    let markup = images.map(image => { return getGalleryItemMarkup(image) }).join('');
    let listMarkup = `<ul class="pictures-list">${markup}<ul/>`;
    refs.gallery.insertAdjacentHTML("beforeend", listMarkup);
    return Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
  } else {
  // Якщо нічого не знайдено
    return Notiflix.Notify.info ('Sorry, there are no images matching your search query. Please try again.')
  }

}


// Встановлюємо слухача на вхідні дані пошукового блоку
refs.searchForm.addEventListener(
  'submit', imageTagInputHandler);

async function imageTagInputHandler(event) {
  event.preventDefault();
  let imageTag = refs.searchQuery.value.trim();
  
  // Очищення попередніх результатів
  clearPage ();
  
  // Якщо введено дані, то робимо рендер сторінки
  if (imageTag !== '') {
    await renderGallery (imageTag);
  }
}


refs.loadMoreBtn.addEventListener(
  'click', loadMoreHandler);

async function loadMoreHandler() {

  let imageTag = refs.searchQuery.value.trim();
  page += 1;
  await renderGallery (imageTag);
}