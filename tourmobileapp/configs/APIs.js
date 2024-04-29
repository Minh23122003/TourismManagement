import axios from "axios";

const BASE_URL = 'https://thanhduong.pythonanywhere.com/';

export const endpoints = {
    'categories': '/categories/',
    'destinations': '/destinations/'
}

export default axios.create({
    baseURL: BASE_URL
});