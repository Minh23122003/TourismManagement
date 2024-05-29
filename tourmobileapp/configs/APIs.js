import axios from "axios";

// const BASE_URL = 'https://minhdong.pythonanywhere.com/'
const BASE_URL = 'http://192.168.1.4:8000/'

export const endpoints = {
    'cateTours': '/tours-category/',
    'tours': '/tours/',
    'tour-details': (tourId) => `/tours/${tourId}/`,
    'cateNews': '/news-category/',
    'news': '/news/',
    'news-details': (newsId) => `/news/${newsId}/`,
    'login': `/o/token/`,
    'current-user': '/user/current-user/',
    'register': '/user/',
    'commentTour': (tourId) => `/tours/${tourId}/get-comment/`,
    'commentNews': (newsId) => `/news/${newsId}/get-comment/`,
    'addCommentTour': (tourId) => `/tours/${tourId}/post-comment/`,
    'addCommentNews': (newsId) => `/news/${newsId}/post-comment/`,
    'addLike': (newsId) => `/news/${newsId}/post-like/`,
    'like': (newsId) => `/news/${newsId}/get-like/`,
    'addRating': (tourId) => `/tours/${tourId}/post-rating/`,
    'rating': (tourId) => `/tours/${tourId}/get-rating/`,
    'addBooking': (tourId) => `/tours/${tourId}/post-booking/`,
    'deleteBooking': (id) => `/booking/${id}/`,
    'booking': `/user/get-booking/`
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