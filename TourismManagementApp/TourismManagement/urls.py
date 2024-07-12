from django.urls import path, include
from django.contrib import admin
from TourismManagement import views
from rest_framework import routers

r = routers.DefaultRouter()

r.register('tours', views.TourViewSet, basename='tours')
r.register('tours-category', views.TourCategoryViewSet, basename='tours-category')
r.register('news', views.NewsViewSet, basename='news')
r.register('news-category', views.NewsCategoryViewSet, basename='news-category')
r.register('user', views.UserViewSet, basename='user')
r.register('booking', views.BookingViewSet, basename='booking')
r.register('comment-tour', views.CommentTourViewSet, basename='comment-tour')
r.register('comment-news', views.CommentNewsViewSet, basename='comment-news')
r.register('customer', views.CustomerViewSet, basename='customer')



urlpatterns = [
    path('admin_tools_stats/', include('admin_tools_stats.urls')),
    path('', include(r.urls))
]