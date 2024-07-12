import axios from "axios";

// const BASE_URL = 'https://minhdong.pythonanywhere.com/'
const BASE_URL = 'http://192.168.1.5:8000/'

export const endpoints = {
    'cateTours': '/tours-category/',
    'tours': '/tours/',
    'tour-details': (tourId) => `/tours/${tourId}/`,
    'commentTour': (tourId) => `/tours/${tourId}/get-comment/`,
    'addCommentTour': (tourId) => `/tours/${tourId}/post-comment/`,
    'deleteCommentTour': (commentTourId) => `/comment-tour/${commentTourId}/`,
    'patchCommentTour': '/comment-tour/patch-comment-tour/',
    'cateNews': '/news-category/',
    'addRating': (tourId) => `/tours/${tourId}/post-rating/`,
    'rating': (tourId) => `/tours/${tourId}/get-rating/`,
    'news': '/news/',
    'news-details': (newsId) => `/news/${newsId}/`,
    'commentNews': (newsId) => `/news/${newsId}/get-comment/`,
    'addCommentNews': (newsId) => `/news/${newsId}/post-comment/`,
    'deleteCommentNews': (commentNewsId) => `/comment-news/${commentNewsId}/`,
    'addLike': (newsId) => `/news/${newsId}/post-like/`,
    'like': (newsId) => `/news/${newsId}/get-like/`,
    'patchCommentNews': '/comment-news/patch-comment-news/',
    'login': '/o/token/',
    'current-user': '/user/current-user/',
    'register': '/user/',  
    'addBooking': (tourId) => `/tours/${tourId}/post-booking/`,
    'deleteBooking': (id) => `/booking/${id}/`,
    'booking': '/user/get-booking/',
    'pay': '/booking/pay/',
    'customer': '/customer/post-customer/',
    'putCustomer': '/customer/put-customer/',  
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