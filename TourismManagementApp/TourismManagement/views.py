from rest_framework import viewsets, generics, permissions, status, parsers
from TourismManagement import serializers, paginators
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import *
from datetime import datetime
from django.http import JsonResponse


class TourViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):

    queryset = Tour.objects.filter(active=True)
    serializer_class = serializers.TourDetailsSerializer
    pagination_class = paginators.TourPaginator

    def get_permissions(self):
        if self.action in ['add_rating', 'get_rating', 'add_comment', 'add_booking']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]


    def get_serializer_class(self):
        if self.request.user.is_authenticated:
            return serializers.TourRating
        return self.serializer_class

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
            cate_id = self.request.query_params.get('cate_id')
            if cate_id:
                queries = queries.filter(tour_category_id=cate_id)
        return queries

    @action(methods=['get'], url_path='get-comments', detail=True)
    def get_comments(self, request, pk):
        comments = self.get_object().commenttour_set.select_related('user').order_by('-updated_date')

        paginator = paginators.CommentPaginator()
        page = paginator.paginate_queryset(comments, request)
        if page is not None:
            serializer = serializers.CommentTourSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        return Response(serializers.CommentTourSerializer(comments, many=True).data)

    @action(methods=['post'], url_path='comments', detail=True)
    def add_comment(self, request, pk):
        c = self.get_object().commenttour_set.create(content=request.data.get('content'), user=request.user)

        return Response(serializers.CommentTourSerializer(c).data, status=status.HTTP_201_CREATED)

    @action(methods=['get'], url_path='get-rating', detail=True)
    def get_rating(self, request, pk):
        try:
            rating = Rating.objects.get(tour=self.get_object(), user=request.user)
            return Response(serializers.RatingSerializer(rating).data)
        except:
            return JsonResponse({'stars': 0})



    @action(methods=['post'], url_path='ratings', detail=True)
    def add_rating(self, request, pk):
        rating, created = Rating.objects.update_or_create(tour=self.get_object(), user=request.user, create_defaults={'stars':request.data.get('stars') })

        if not created:
            rating.stars = request.data.get('stars')
            rating.save()
        return Response(serializers.RatingSerializer(rating).data)

    @action(methods=['post'], url_path='booking', detail=True)
    def add_booking(self, request, pk):
        book = Booking.objects.filter(tour_id=self.get_object().id)
        remain = self.get_object().quantity_ticket
        if book:
            for b in book:
                remain = remain - b.quantity_ticket_adult - b.quantity_ticket_children
        if remain >= (int(request.data.get('quantity_ticket_adult')) + int(request.data.get('quantity_ticket_children'))):
            booking, created = Booking.objects.update_or_create(user=request.user, tour=self.get_object(), create_defaults={'quantity_ticket_adult':request.data.get('quantity_ticket_adult'), 'quantity_ticket_children':request.data.get('quantity_ticket_children')})


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
                serializer.save()
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

            if not created:
                booking.quantity_ticket_adult = request.data.get('quantity_ticket_adult')
                booking.quantity_ticket_children = request.data.get('quantity_ticket_children')
                booking.save()
            return Response(serializers.BookingSerializer(booking).data, status=status.HTTP_200_OK)
        else:
            return JsonResponse({'content': 'Tong so ve phai nho hon hoac bang so ve con lai'}, status=status.HTTP_406_NOT_ACCEPTABLE)




class TourCategoryViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = TourCategory.objects.filter(active=True)
    serializer_class = serializers.TourCategorySerializer


class NewsViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):

    queryset = News.objects.filter(active=True)
    serializer_class = serializers.NewsDetailsSerializer
    pagination_class = paginators.NewsPaginator

    def get_queryset(self):
        queries = self.queryset
        if self.action.__eq__('list'):
            cate_id = self.request.query_params.get('cate_id')
            if cate_id:
                queries = queries.filter(news_category_id=cate_id)
        return queries

    def get_permissions(self):
        if self.action in ['add_like', 'get_like', 'add_comment']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]


    def get_serializer_class(self):
        if self.request.user.is_authenticated:
            return serializers.TourRating
        return self.serializer_class

    @action(methods=['get'], url_path='get-comments', detail=True)
    def get_comments(self, request, pk):
        comments = self.get_object().commentnews_set.select_related('user').order_by('id')

        paginator = paginators.CommentPaginator()
        page = paginator.paginate_queryset(comments, request)
        if page is not None:
            serializer = serializers.CommentNewsSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        return Response(serializers.CommentNewsSerializer(comments, many=True).data)

    @action(methods=['post'], url_path='comments', detail=True)
    def add_comment(self, request, pk):
        c = self.get_object().commentnews_set.create(content=request.data.get('content'), user=request.user)

        return Response(serializers.CommentNewsSerializer(c).data, status=status.HTTP_201_CREATED)

    @action(methods=['get'], url_path='get-like', detail=True)
    def get_like(self, request, pk):
        try:
            like = Like.objects.get(user=request.user, news=self.get_object())
            return Response(serializers.LikeSerializer(like).data)
        except:
            return JsonResponse({"active": False})

    @action(methods=['post'], url_path='likes', detail=True)
    def add_like(self, request, pk):
        like, created = Like.objects.get_or_create(news=self.get_object(), user=request.user)

        if not created:
            like.active = not like.active
            like.save()

        return Response(serializers.LikeSerializer(like).data)



class NewsCategoryViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = NewsCategory.objects.filter(active=True)
    serializer_class = serializers.NewsCategorySerializer


class UserViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = serializers.UserSerializer
    parser_classes = [parsers.MultiPartParser]

    def get_permissions(self):
        if self.action in ['get_current_user']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    @action(methods=['get', 'put'], url_path='current-user', detail=False)
    def get_current_user(self, request):
        user = request.user
        if request.method.__eq__('PUT'):
            for k, v in request.data.items():
                setattr(user, k, v)
            user.save()

        return Response(serializers.UserSerializer(user).data)

