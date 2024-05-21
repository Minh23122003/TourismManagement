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



urlpatterns = [
    path('', include(r.urls))
]