import axios from "axios";
export { fetchImages };

axios.defaults.baseURL = 'https://pixabay.com/api/';
const API_KEY = '34745149-9c1a1f7368328a4e195b98e7c';

async function fetchImages(searchQuery, page, perPage) {
  const response = await axios.get(
    `?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`,
  );
  return response;
}
