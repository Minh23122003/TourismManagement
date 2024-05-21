import axios from "axios";

// const BASE_URL = 'https://thanhduong.pythonanywhere.com/';
const BASE_URL = 'http://192.168.1.4:8000/'

export const endpoints = {
    'cateTours': '/tours-category/',
    'tours': '/tours/',
    'tour-details': (tourId) => `/tours/${tourId}/`,
    'cateNews': '/news-category/',
    'news': '/news/'
}

export default axios.create({
    baseURL: BASE_URL
});