import axios from "axios";

// const BASE_URL = 'https://minhdong.pythonanywhere.com/'
const BASE_URL = 'http://192.168.1.5:8000/'
// const BASE_URL = 'http://192.168.204.211:8000/'

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
    'commentTour': (tourId) => `/tours/${tourId}/get-comment/`,
    'deleteCommentTour': (commentTourId) => `/comment-tour/${commentTourId}/`,
    'patchCommentTour': '/comment-tour/patch-comment-tour/',
    'commentNews': (newsId) => `/news/${newsId}/get-comment/`,
    'deleteCommentNews': (commentNewsId) => `/comment-news/${commentNewsId}/`,
    'patchCommentNews': '/comment-news/patch-comment-news/',
    'addCommentTour': (tourId) => `/tours/${tourId}/post-comment/`,
    'addCommentNews': (newsId) => `/news/${newsId}/post-comment/`,
    'addLike': (newsId) => `/news/${newsId}/post-like/`,
    'like': (newsId) => `/news/${newsId}/get-like/`,
    'addRating': (tourId) => `/tours/${tourId}/post-rating/`,
    'rating': (tourId) => `/tours/${tourId}/get-rating/`,
    'addBooking': (tourId) => `/tours/${tourId}/post-booking/`,
    'deleteBooking': (id) => `/booking/${id}/`,
    'booking': '/user/get-booking/',
    'pay': '/booking/pay/',
    'deleteTour': (tourId) => `/tours/${tourId}/`,
    'deleteNews': (newsId) => `/news/${newsId}/`,
    'test': '/tourimage/'
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