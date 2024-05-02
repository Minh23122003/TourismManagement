from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404
from rest_framework import viewsets, generics, permissions, status, mixins
from TourismManagement import serializers
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import *
from .paginators import NewsPaginator

class StaffViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView,
                   generics.RetrieveAPIView, generics.DestroyAPIView, generics.UpdateAPIView):
    queryset = Staff.objects.filter(active=True)
    serializer_class = serializers.StaffSerializer


class CustomerViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView,
                      generics.DestroyAPIView, generics.UpdateAPIView, generics.RetrieveAPIView):

    serializer_class = serializers.CustomerSerializer
    queryset = Customer.objects.filter(active=True)
    permission_classes = [permissions.IsAuthenticated]


class AdminViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView,
                   generics.DestroyAPIView, generics.UpdateAPIView, generics.RetrieveAPIView):

    queryset = Admin.objects.filter(active=True)
    serializer_class = serializers.AdminSerializer
    permission_classes = [permissions.IsAuthenticated]


class ReportViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView,
                    generics.RetrieveAPIView, generics.DestroyAPIView, generics.UpdateAPIView):

    serializer_class = serializers.ReportSerializer
    queryset = Report.objects.filter(active=True)
    permission_classes = [permissions.IsAuthenticated]


class TourViewSet(viewsets.ViewSet, generics.ListAPIView,
                  generics.CreateAPIView, generics.DestroyAPIView, generics.UpdateAPIView):

    queryset = Tour.objects.filter(active=True)
    serializer_class = serializers.TourSerializer

    # lấy tour theo trường
    # example: url= .../?start_date=02-05-2024&price_adult=100000
    # example url= .../?start_date=02-05-2024
    # Api dùng cho chứng năng lọc chi tiết tour: giá, ngày, chuyến đi
    # xét 5 fields có 25 cases
    def retrieve(self, request, pk=None):

        if request.get('destination'):
            destination = request.get('destination')
            tour = Tour.objects.filter(destination=destination)
            if tour.get('start_date'):
                date = tour.get('start_date')
                tour = tour.filter(start_date=date)
                if tour.get('end_date'):
                    date = tour.get('end_date')
                    tour = tour.filter(end_date=date)
                    if tour.get('price_adult'):
                        price = tour.get('price_adult')
                        tour = tour.filter(price_adult=price)
                    if tour.get('price_children'):
                        price = tour.get('price_children')
                        tour = tour.filter(price_children=price)

            serializer = serializers.TourSerializer(tour, many=True)
            return Response(data=serializer.data, status=status.HTTP_200_OK)

        if request.get('start_date'):
            date = request.get('start_date')
            tour = Tour.objects.filter(start_date=date)
            if request.get('end_date'):
                date = request.get('end_date')
                tour = tour.filter(end_date=date)
                if request.get('price_adult'):
                    price = request.get('price_adult')
                    tour = tour.filter(price_adult=price)
                    if tour.get('price_children'):
                        price = request.get('price_children')
                        tour = tour.filter(price_children=price)
                        if tour.get('destination'):
                            destination = request.get('destination')
                            tour = tour.filter(destination=destination)

            serializer = serializers.TourSerializer(tour, many=True)
            return Response(data=serializer.data, status=status.HTTP_200_OK)

        if request.get('end_date'):
            date = request.get('end_date')
            tour = Tour.objects.filter(end_date=date)
            if request.get('start_date'):
                date = request.get('start_date')
                tour = tour.filter(start_date=date)
                if request.get('price_children'):
                    price = request.get('price_children')
                    tour = tour.filter(price_children=price)
                    if request.get('price_adult'):
                        price = request.get('price_adult')
                        tour = tour.filter(price_adult=price)
                        if tour.get('destination'):
                            destination = request.get('destination')
                            tour = tour.filter(destination=destination)

            serializer = serializers.TourSerializer(tour, many=True)
            return Response(data=serializer.data, status=status.HTTP_200_OK)

        if request.get('price_adult'):
            price = request.get('price_adult')
            tour = Tour.objects.filter(price_adult=price)
            if request.get('price_children'):
                price = request.get('price_children')
                tour = tour.filter(price_children=price)
                if request.get('start_date'):
                    date = request.get('start_date')
                    tour = tour.filter(start_date=date)
                    if request.get('end_date'):
                        date = request.get('end_date')
                        tour = tour.filter(end_date=date)
                        if tour.get('destination'):
                            destination = request.get('destination')
                            tour = tour.filter(destination=destination)

            serializer = serializers.TourSerializer(tour, many=True)
            return Response(data=serializer.data, status=status.HTTP_200_OK)

        if request.get('price_children'):
            price = request.get('price_children')
            tour = Tour.objects.filter(price_children=price)
            if request.get('price_adult'):
                price = request.get('price_adult')
                tour = tour.filter(price_adult=price)
                if request.get('start_date'):
                    date = request.get('start_date')
                    tour = tour.filter(start_date=date)
                    if request.get('end_date'):
                        date = request.get('end_date')
                        tour = tour.filter(end_date=date)
                        if tour.get('destination'):
                            destination = request.get('destination')
                            tour = tour.filter(destination=destination)

            serializer = serializers.TourSerializer(tour, many=True)
            return Response(data=serializer.data, status=status.HTTP_200_OK)

        return Response(status=status.HTTP_404_NOT_FOUND)
    @action(methods=['get'], detail=True,
            name='Get ratings per tour',
            url_path='ratings',
            url_name='ratings'
            )
    def get_rating(self, request, pk):
        try:
            rating = Rating.objects.get(pk=pk)

            serializer = serializers.RatingSerializer(rating, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Rating.DoesNotExist as err:
            return Response(data={'message': err}, status=status.HTTP_404_NOT_FOUND)

    @action(methods=['post'], detail=True,
            name='Post ratings per tour',
            url_path='ratings',
            url_name='ratings'
            )
    def post_rating(self, request, pk):
        try:
            stars = request.data['stars']
            tour_id = request.data['tour_id']
            customer_id = request.user['id']

            rating = Rating.objects.create(stars=stars, customer_id=customer_id, tour_id=tour_id)
            rating.save()

            serializer = serializers.RatingSerializer(rating)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Rating.DoesNotExist as err:
            return Response(data={"message": err}, status=status.HTTP_404_NOT_FOUND)

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]

        return [permissions.IsAuthenticated()]


class TourImageViewSet(viewsets.ViewSet, generics.CreateAPIView,
                       generics.ListAPIView, generics.DestroyAPIView):
    queryset = TourImage.objects.filter(active=True)
    serializer_class = serializers.TourImageSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]

        return [permissions.IsAuthenticated()]


class TourCategoryViewSet(viewsets.ViewSet, generics.CreateAPIView,
                          generics.ListAPIView, generics.DestroyAPIView):
    queryset = TourCategory.objects.filter(active=True)
    serializer_class = serializers.TourCategorySerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]

        return [permissions.IsAuthenticated()]


class DestinationViewSet(viewsets.ViewSet, generics.CreateAPIView,
                         generics.ListAPIView, generics.DestroyAPIView):

    queryset = Destination.objects.filter(active=True)
    serializer_class = serializers.DestinationSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]

        return [permissions.IsAuthenticated()]


class BookingViewSet(viewsets.ViewSet, generics.ListAPIView, generics.DestroyAPIView,
                     generics.RetrieveAPIView, generics.CreateAPIView, generics.UpdateAPIView):

    queryset = Booking.objects.filter(active=True)
    serializer_class = serializers.BookingSerializer
    permission_classes = [permissions.IsAuthenticated]


class BillViewSet(viewsets.ViewSet, generics.ListAPIView, generics.DestroyAPIView,
                  generics.RetrieveAPIView, generics.CreateAPIView, generics.UpdateAPIView):

    queryset = Bill.objects.filter(active=True)
    serializer_class = serializers.BillSerializer
    permission_classes = [permissions.IsAuthenticated]


class NewsViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView,
                  generics.RetrieveAPIView, generics.UpdateAPIView, generics.DestroyAPIView):

    queryset = News.objects.filter(active=True)
    serializer_class = serializers.NewsSerializer
    pagination_class = NewsPaginator

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]

        return [permissions.IsAuthenticated()]


class NewsImageViewSet(viewsets.ViewSet, generics.CreateAPIView,
                       generics.ListAPIView, generics.DestroyAPIView):
    queryset = NewsImage.objects.filter(active=True)
    serializer_class = serializers.NewsImageSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]

        return [permissions.IsAuthenticated()]

# Không có retrieve vì news category, tour category chỉ tỏng để thống kê
class NewsCategoryViewSet(viewsets.ViewSet, generics.CreateAPIView,
                          generics.ListAPIView, generics.DestroyAPIView):
    queryset = NewsCategory.objects.filter(active=True)
    serializer_class = serializers.NewsCategorySerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]

        return [permissions.IsAuthenticated()]


# rating  cũng tương tự như tour category, news category
class RatingViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView,
                    generics.UpdateAPIView, generics.DestroyAPIView):
    serializer_class = serializers.RatingSerializer
    queryset = Rating.objects.filter(active=True)

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]

        return [permissions.IsAuthenticated()]



# like cũng tương tự như tour category, news category
class LikeViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView,
                  generics.DestroyAPIView):
    serializer_class = serializers.LikeSerializer
    queryset = Like.objects.filter(active=True)

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]

        return [permissions.IsAuthenticated()]


class CommentTourViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView,
                         generics.DestroyAPIView):
    queryset = CommentTour.objects.filter(active=True)
    serializer_class = serializers.CommentTourSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]

        return [permissions.IsAuthenticated()]


class CommentNewsViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView,
                        generics.DestroyAPIView):
    queryset = CommentNews.objects.filter(active=True)
    serializer_class = serializers.CommentNewsSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]

        return [permissions.IsAuthenticated()]
