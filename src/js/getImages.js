import axios from 'axios';

async function getImages() {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '23381165-23963a51c09328db6c17876e7',
        q: 'cat',
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: 1,
        per_page: 40,
      },
    });
    console.log (response);
  } catch (error) {
    console.error (error);
  }
}

export default getImages();