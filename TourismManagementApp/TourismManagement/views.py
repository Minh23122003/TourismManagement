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
        if self.action in ['add_rating', 'get_rating', 'add_comment']:
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
        rating = Rating.objects.get(tour=self.get_object(), user=request.user)
        if rating:
            return Response(serializers.RatingSerializer(rating).data)
        return JsonResponse({'stars': 0})



    @action(methods=['post'], url_path='ratings', detail=True)
    def add_rating(self, request, pk):
        rating, created = Rating.objects.get_or_create(tour=self.get_object(), user=request.user)

        if not created:
            rating.stars = request.data.get('stars')
            rating.save()

        return Response(serializers.RatingSerializer(rating).data)


class TourCategoryViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = TourCategory.objects.filter(active=True)
    serializer_class = serializers.TourCategorySerializer

    @action(methods=['get'], url_path='tours', detail=True)
    def tour(self, request, pk):
        tours = self.get_object().tour_set.filter(active=True).all()
        return Response(serializers.TourDetailsSerializer(tours, many=True, context={'request':request}).data, status.HTTP_200_OK)


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
        like = Like.objects.get(user=request.user, news=self.get_object())
        if like:
            return Response(serializers.LikeSerializer(like).data)
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

    @action(methods=['get'], url_path='news', detail=True)
    def news(self, request, pk):
        news = self.get_object().news_set.filter(active=True).all()
        return Response(serializers.NewsDetailsSerializer(news, many=True, context={'request': request}).data,
                        status.HTTP_200_OK)

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

