from rest_framework import viewsets, generics, permissions, status, parsers
from TourismManagement import serializers, paginators
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import *
from datetime import datetime


class StaffViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView, generics.RetrieveAPIView, generics.UpdateAPIView):
    queryset = Staff.objects.filter(active=True)
    serializer_class = serializers.StaffSerializer
    permission_classes = [permissions.IsAdminUser]

class CustomerViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.UpdateAPIView, generics.ListAPIView):

    serializer_class = serializers.CustomerSerializer
    queryset = Customer.objects.filter(active=True)

    #
    #
    # POST == 'Allow Any vì user có thể là guest
    def get_permissions(self):
        if self.request.method == 'POST' or self.request.method=='GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

class AdminViewSet(viewsets.ViewSet):
    queryset = Admin.objects.filter(active=True)
    serializer_class = serializers.AdminSerializer
    permission_classes = [permissions.IsAdminUser()]


class ReportViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.RetrieveAPIView):
    serializer_class = serializers.ReportSerializer
    queryset = Report.objects.filter(active=True)
    permission_classes = [permissions.IsAdminUser()]


class TourViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView):

    queryset = Tour.objects.filter(active=True)
    serializer_class = serializers.TourDetailsSerializer
    pagination_class = paginators.TourPaginator

    def get_queryset(self):
        queries = self.queryset
        if self.action.__eq__('list'):
            price_min = self.request.query_params.get('price_min')
            if price_min:
                queries = queries.filter(price_adult__gte=int(price_min))
            price_max = self.request.query_params.get('price_max')
            if price_max:
                queries = queries.filter(price_adult__lte=int(price_max))
            start_date = self.request.query_params.get('start_date')
            try:
                if start_date:
                    queries = queries.filter(start_date__gt=datetime.strptime(start_date, '%d-%m-%Y'))
            except:
                queries = queries
            destination = self.request.query_params.get('destination')
            destination = Destination.objects.filter(location=destination)
            if destination:
                queries = queries.filter(destination__in=destination).distinct()
            id = self.request.query_params.get('id')
            if id:
                queries = queries.filter(id=int(id))
            cate_id = self.request.query_params.get('cate_id')
            if cate_id:
                queries = queries.filter(tour_category_id=cate_id)
        return queries

    def partial_update(self, request, pk=None):
        tour_object = self.get_object()
        serializer = self.get_serializer(tour_object, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    @action(methods=['get'], detail=True,
            name='Get ratings per tour',
            url_path='get-ratings',
            )
    def get_rating(self, request, pk):
        try:
            rating = Rating.objects.filter(tour_id=pk).all()

            serializer = serializers.RatingSerializer(rating, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Rating.DoesNotExist as err:
            return Response(data={'message': err}, status=status.HTTP_404_NOT_FOUND)

    @action(methods=['post'], detail=True,
            name='Post ratings per tour',
            url_path='post-ratings',
            )
    def post_rating(self, request, pk):
        try:

            data = request.data
            rating = Rating()
            rating.customer = Customer.objects.filter(id=data.get("customer")).first()
            rating.stars = data.get("stars")
            rating.tour= self.get_object()
            rating.save()
            serializer = serializers.RatingSerializer(rating, request.data)
            if serializer.is_valid(raise_exception=True):
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Rating.DoesNotExist as err:
            return Response(data={"message": err}, status=status.HTTP_404_NOT_FOUND)


    @action(methods=['patch'], detail=True,
            name='Update ratings per tour',
            url_path='update-ratings/(?P<id>[^/.]+)',
            )
    def partial_update_rating(self, request, pk=None, id=None):
        try:
            rating = Rating.objects.get(id=int(id))
            serializer = serializers.RatingSerializer(rating, data=request.data, partial=True)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Rating.DoesNotExist as err:
            return Response(data={"message": err}, status=status.HTTP_404_NOT_FOUND)

    ###### ###### ##  ## ######
      ##   ##  ## ##  ## ######
      ##   ###### ###### ## ###
    @action(methods=['get'], detail=True,
            name='Get comment tour per tour',
            url_path='get-comments',
            )
    def get_comment_tour(self, request, pk):
        try:
            comment = CommentTour.objects.filter(tour_id=pk).all()

            serializer = serializers.CommentTourSerializer(comment, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Rating.DoesNotExist as err:
            return Response(data={'message': err}, status=status.HTTP_404_NOT_FOUND)

    @action(methods=['post'], detail=True,
            name='Post comment per tour',
            url_path='post-comments',
            )
    def post_comment_tour(self, request, pk):
        try:

            data = request.data
            comment = CommentTour()
            comment.customer = Customer.objects.filter(id=data.get("customer")).first()
            comment.content = data.get("content")
            comment.tour = self.get_object()
            comment.save()
            serializer = serializers.CommentTourSerializer(comment, request.data)
            if serializer.is_valid(raise_exception=True):
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Rating.DoesNotExist as err:
            return Response(data={"message": err}, status=status.HTTP_404_NOT_FOUND)

    @action(methods=['patch'], detail=True,
            name='Update comment per tour',
            url_path='update-comments/(?P<id>[^/.]+)',
            )
    def partial_update_comment_tour(self, request, pk=None, id=None):
        try:
            comment = CommentTour.objects.get(id=int(id))
            serializer = serializers.CommentTourSerializer(comment, data=request.data, partial=True)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Rating.DoesNotExist as err:
            return Response(data={"message": err}, status=status.HTTP_404_NOT_FOUND)


    @action(methods=['delete'], detail=True,
            name='Delete comment per tour',
            url_path='delete-comments/(?P<id>[^/.]+)',
            )
    def delete_comment_tour(self, request, pk=None, id=None):
        try:
            comment = CommentTour.objects.filter(id=int(id)).first()
            comment.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Rating.DoesNotExist as err:
            return Response(data={"message": err}, status=status.HTTP_404_NOT_FOUND)








    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]

        return [permissions.IsAdminUser()]


class TourImageViewSet(viewsets.ViewSet, generics.CreateAPIView,generics.ListAPIView, generics.UpdateAPIView, generics.DestroyAPIView):
    queryset = TourImage.objects.filter(active=True).all()
    serializer_class = serializers.TourImageSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]

        return [permissions.IsAdminUser()]


class TourCategoryViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView, generics.UpdateAPIView):
    queryset = TourCategory.objects.filter(active=True)
    serializer_class = serializers.TourCategorySerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    @action(methods=['get'], url_path='tours', detail=False)
    def tour(self, request, pk):
        tours = self.get_object().tour_set.filter(active=True).all()
        return Response(serializers.TourSerializer(tours, many=True, context={'request':request}).data, status.HTTP_200_OK)


class DestinationViewSet(viewsets.ViewSet, generics.CreateAPIView,
                         generics.ListAPIView, generics.UpdateAPIView):

    queryset = Destination.objects.filter(active=True)
    serializer_class = serializers.DestinationSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class BookingViewSet(viewsets.ViewSet, generics.RetrieveAPIView, generics.ListAPIView, generics.CreateAPIView, generics.UpdateAPIView):

    queryset = Booking.objects.filter(active=True)
    serializer_class = serializers.BookingSerializer
    permission_classes = [permissions.IsAuthenticated]


class BillViewSet(viewsets.ViewSet, generics.RetrieveAPIView, generics.ListAPIView, generics.CreateAPIView, generics.UpdateAPIView):

    queryset = Bill.objects.filter(active=True)
    serializer_class = serializers.BillSerializer
    permission_classes = [permissions.IsAuthenticated]


class NewsViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView, generics.RetrieveAPIView, generics.UpdateAPIView):

    queryset = News.objects.filter(active=True)
    serializer_class = serializers.NewsSerializer
    pagination_class = paginators.NewsPaginator

    @action(methods=['get'], detail=True,
            name='Get likes per tour',
            url_path='get-likes',
            )
    def get_like(self, request, pk):
        try:
            like = Like.objects.filter(news_id=pk).all()

            serializer = serializers.LikeSerializer(like, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Rating.DoesNotExist as err:
            return Response(data={'message': err}, status=status.HTTP_404_NOT_FOUND)

    @action(methods=['post'], detail=True,
            name='Post likes per tour',
            url_path='post-likes',
            )
    def post_like(self, request, pk):
        try:
            data = request.data
            like = Like()
            like.customer = Customer.objects.filter(id=data.get("customer")).first()
            like.news = self.get_object()
            like.save()
            serializer = serializers.LikeSerializer(like, request.data)
            if serializer.is_valid(raise_exception=True):
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Rating.DoesNotExist as err:
            return Response(data={"message": err}, status=status.HTTP_404_NOT_FOUND)

    @action(methods=['patch'], detail=True,
            name='Update likes per tour',
            url_path='update-likes/(?P<id>[^/.]+)',
            )
    def partial_update_like(self, request, pk=None, id=None):
        try:
            like = Like.objects.get(id=int(id))
            serializer = serializers.LikeSerializer(like, data=request.data, partial=True)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Rating.DoesNotExist as err:
            return Response(data={"message": err}, status=status.HTTP_404_NOT_FOUND)

  ###### ###### ##  ## ######
    ##   ##  ## ##  ## ######
    ##   ###### ###### ## ###
    @action(methods=['get'], detail=True,
            name='Get comment tour per tour',
            url_path='get-comments',
            )
    def get_comment_news(self, request, pk):
        try:
            comment = CommentNews.objects.filter(news_id=pk).all()

            serializer = serializers.CommentNewsSerializer(comment, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Rating.DoesNotExist as err:
            return Response(data={'message': err}, status=status.HTTP_404_NOT_FOUND)

    @action(methods=['post'], detail=True,
            name='Post comment per tour',
            url_path='post-comments',
            )
    def post_comment_tour(self, request, pk):
        try:

            data = request.data
            comment = CommentNews()
            comment.customer = Customer.objects.filter(id=data.get("customer")).first()
            comment.content = data.get("content")
            comment.news = self.get_object()
            comment.save()
            serializer = serializers.CommentNewsSerializer(comment, request.data)
            if serializer.is_valid(raise_exception=True):
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Rating.DoesNotExist as err:
            return Response(data={"message": err}, status=status.HTTP_404_NOT_FOUND)

    @action(methods=['patch'], detail=True,
            name='Update ratings per tour',
            url_path='update-comments/(?P<id>[^/.]+)',
            )
    def partial_update_comment_tour(self, request, pk=None, id=None):
        try:
            comment = CommentNews.objects.get(id=int(id))
            serializer = serializers.CommentNewsSerializer(comment, data=request.data, partial=True)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Rating.DoesNotExist as err:
            return Response(data={"message": err}, status=status.HTTP_404_NOT_FOUND)

    @action(methods=['delete'], detail=True,
            name='Delete ratings per tour',
            url_path='delete-comments/(?P<id>[^/.]+)',
            )
    def delete_comment_tour(self, request, pk=None, id=None):
        try:
            comment = CommentNews.objects.filter(id=int(id)).first()
            comment.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Rating.DoesNotExist as err:
            return Response(data={"message": err}, status=status.HTTP_404_NOT_FOUND)

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]


class NewsImageViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView, generics.UpdateAPIView):
    queryset = NewsImage.objects.filter(active=True)
    serializer_class = serializers.NewsImageSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]

        return [permissions.IsAuthenticated()]

# Không có retrieve vì news category, tour category chỉ tỏng để thống kê
class NewsCategoryViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView, generics.UpdateAPIView):
    queryset = NewsCategory.objects.filter(active=True)
    serializer_class = serializers.NewsCategorySerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]

        return [permissions.IsAuthenticated()]


# rating  cũng tương tự như tour category, news category
class RatingViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView):
    serializer_class = serializers.RatingSerializer
    queryset = Rating.objects.filter(active=True)

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]

        return [permissions.IsAuthenticated()]



# like cũng tương tự như tour category, news category
class LikeViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView):
    serializer_class = serializers.LikeSerializer
    queryset = Like.objects.filter(active=True)

    def partial_update(self, request, pk=None):
        like_object = self.get_object()
        serializer = self.get_serializer(like_object, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]

        return [permissions.IsAuthenticated()]


class CommentTourViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView):
    queryset = CommentTour.objects.filter(active=True)
    serializer_class = serializers.CommentTourSerializer

    def partial_update(self, request, pk=None):
        comment_object = self.get_object()
        serializer = self.get_serializer(comment_object, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]

        return [permissions.IsAuthenticated()]


class CommentNewsViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView):
    queryset = CommentNews.objects.filter(active=True)
    serializer_class = serializers.CommentNewsSerializer

    def partial_update(self, request, pk=None):
        comment_object = self.get_object()
        serializer = self.get_serializer(comment_object, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]

        return [permissions.IsAuthenticated()]


class UserViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = serializers.UserSerializer
    parser_classes = [parsers.MultiPartParser]

    def get_permissions(self):
        if self.action in ['get_current_user']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]
