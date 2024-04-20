from django.urls import path, include
from django.contrib import admin
from TourismManagement import views
from rest_framework import routers

r = routers.DefaultRouter()
r.register('staffs', views.StaffViewSet, basename='staffs')
r.register('customers', views.CustomerViewSet, basename='customers')
r.register('admins', views.AdminViewSet, basename='admins')
r.register('reports', views.ReportViewSet, basename='reports')
r.register('tours', views.TourViewSet, basename='tours')
r.register('tours-image', views.TourImageViewSet, basename='tours-image')
r.register('tours-category', views.TourCategoryViewSet, basename='tours-category')
r.register('destination', views.TourViewSet, basename='destinations')
r.register('bookings', views.BookingViewSet, basename='bookings')
r.register('bills', views.BillViewSet, basename='bills')
r.register('news', views.NewsViewSet, basename='news')
r.register('news-category', views.NewsCategoryViewSet, basename='news-category')
r.register('news-image', views.NewsImageViewSet, basename='news-image')
r.register('comments-tour', views.CommentTourViewSet, basename='comments-tour')
r.register('comments-news', views.CommentNewsViewSet, basename='comments-news')
r.register('like', views.LikeViewSet, basename='like')
r.register('rating', views.RatingViewSet, basename='rating')



urlpatterns = [
    path('', include(r.urls))
]