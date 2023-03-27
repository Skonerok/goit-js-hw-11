import axios from "axios";

export default async function fetchImages(searchQuery) {

    const searchParams = new URLSearchParams({
        key: '34745149-9c1a1f7368328a4e195b98e7c',
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        per_page: 40,
        page: 1,
    });

    try {
        const result = await axios.get(`https://pixabay.com/api/?${searchParams}`);
        return result; 
    } catch (error) {
        console.log(error);
    }
};
