from django.urls import path, include
from django.contrib import admin
from TourismManagement import views
from rest_framework import routers

r = routers.DefaultRouter()
r.register('tours', views.TourViewSet, basename='tours')


urlpatterns = [
    path('', include(r.urls))
]