from django.core.exceptions import ObjectDoesNotExist
from requests import Response
from rest_framework import viewsets, generics, permissions, status, mixins
from TourismManagement import serializers
from rest_framework.decorators import action
from .models import *
from TourismManagement import paginators

class StaffViewSet(viewsets.ViewSet):
    serializer_class = serializers.StaffSerializer
    queryset = Staff.objects.all()
    permission_classes = [permissions.IsAuthenticated]


class CustomerViewSet(viewsets.ViewSet):
    serializer_class = serializers.CustomerSerializer
    queryset = Customer.objects.all()
    permission_classes = [permissions.IsAuthenticated]


class AdminViewSet(viewsets.ViewSet):
    queryset = Admin.objects.filter()
    serializer_class = serializers.AdminSerializer
    permission_classes = [permissions.IsAuthenticated]


class ReportViewSet(viewsets.ViewSet):
    serializer_class = serializers.ReportSerializer
    queryset = Report.objects.all()
    permission_classes = [permissions.IsAuthenticated]


class TourViewSet(viewsets.ViewSet, generics.ListAPIView):

    queryset = Tour.objects.filter(active=True)
    serializer_class = serializers.TourSerializer
    pagination_class = paginators.TourPaginator

    @action(methods=['get'], detail=True,
            name='Get ratings per tour',
            url_path='ratings',
            url_name='ratings'
            )
    def get_rating(self, request, tour_id):
        try:
            tour_id = request.data['tour_id']

            rating = Rating.objects.filter(tour_id=tour_id)

            serializer = serializers.RatingSerializer(rating, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Rating.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    @action(methods=['post'], detail=True,
            name='Post ratings per tour',
            url_path='ratings',
            url_name='ratings'
            )
    def post_rating(self, request, tour_id):
        try:
            stars = request.data['stars']
            tour_id = request.data['tour_id']
            customer_id = request.user['id']

            rating = Rating.objects.create(stars=stars,customer_id=customer_id,tour_id=tour_id)
            rating.save()
            serializer = serializers.RatingSerializer(rating)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Rating.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]

        return [permissions.IsAuthenticated()]

class TourImageViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = TourImage.objects.filter(active=True)
    serializer_class = serializers.TourImageSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]

        return [permissions.IsAuthenticated()]


class TourCategoryViewSet(viewsets.ViewSet):
    queryset = TourCategory.objects.filter(active=True)
    serializer_class = serializers.TourCategorySerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]

        return [permissions.IsAuthenticated()]

class DestinationViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Destination.objects.filter(active=True)
    serializer_class = serializers.DestinationSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]

        return [permissions.IsAuthenticated()]

class BookingViewSet(viewsets.ViewSet):
    queryset = Booking.objects.filter(active=True)
    serializer_class = serializers.BookingSerializer
    permission_classes = [permissions.IsAuthenticated]


class BillViewSet(viewsets.ViewSet):
    queryset = Bill.objects.all()
    serializer_class = serializers.BillSerializer
    permission_classes = [permissions.IsAuthenticated]


class NewsViewSet(viewsets.ViewSet):
    queryset = News.objects.filter(active=True)
    serializer_class = serializers.NewsSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]

        return [permissions.IsAuthenticated()]

class NewsImageViewSet(viewsets.ViewSet):
    queryset = NewsImage.objects.filter(active=True)
    serializer_class = serializers.NewsImageSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]

        return [permissions.IsAuthenticated()]


class NewsCategoryViewSet(viewsets.ViewSet):
    queryset = NewsCategory.objects.filter(active=True)
    serializer_class = serializers.NewsCategorySerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]

        return [permissions.IsAuthenticated()]

class RatingViewSet(viewsets.ViewSet):
    serializer_class = serializers.RatingSerializer
    queryset = Rating.objects.filter(active=True)

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]

        return [permissions.IsAuthenticated()]

class LikeViewSet(viewsets.ViewSet):
    serializer_class = serializers.LikeSerializer
    queryset = Like.objects.filter(active=True)
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]

        return [permissions.IsAuthenticated()]

class CommentTourViewSet(viewsets.ViewSet):
    queryset = CommentTour.objects.filter(active=True)
    serializer_class = serializers.CommentTourSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]

        return [permissions.IsAuthenticated()]


class CommentNewsViewSet(viewsets.ViewSet):
    queryset = CommentNews.objects.filter(active=True)
    serializer_class = serializers.CommentNewsSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]

        return [permissions.IsAuthenticated()]

