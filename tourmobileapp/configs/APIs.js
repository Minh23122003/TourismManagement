import axios from "axios";

const BASE_URL = 'http://192.168.1.4:8000/'

export const endpoints = {
    'cateTours': '/tours-category/',
    'tours': '/tours/',
    'tour-details': (tourId) => `/tours/${tourId}/`,
    'cateNews': '/news-category/',
    'news': '/news/',
    'news-details': (newsId) => `/news/${newsId}/`,
    'login': '/o/token/',
    'current-user': '/user/current-user/',
    'register': '/user/',
    'commentTour': (tourId) => `/tours/${tourId}/get-comments/`,
    'commentNews': (newsId) => `/news/${newsId}/get-comments/`,
    'addCommentTour': (tourId) => `/tours/${tourId}/comments/`,
    'addCommentNews': (newsId) => `/news/${newsId}/comments/`,
    'addLike': (newsId) => `/news/${newsId}/likes/`,
    'like': (newsId) => `/news/${newsId}/get-like/`
}

export const authApi = (token) => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

export default axios.create({
    baseURL: BASE_URL
});