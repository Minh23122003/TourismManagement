from rest_framework import viewsets, generics, permissions, status, parsers
from TourismManagement import serializers, paginators
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import *
from datetime import datetime
from django.http import JsonResponse
import datetime


class TourViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView, generics.DestroyAPIView):

    queryset = Tour.objects.filter(active=True).order_by('-id')
    serializer_class = serializers.TourDetailsSerializer
    pagination_class = paginators.TourPaginator

    def get_permissions(self):
        if self.action in ['post_comment', 'get_rating', 'post_rating', 'post_booking']:
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
                queries = queries.filter(price_adult__gte=int(price_min)).order_by('-id')
            price_max = self.request.query_params.get('price_max')
            if price_max:
                queries = queries.filter(price_adult__lte=int(price_max)).order_by('-id')
            start_date = self.request.query_params.get('start_date')
            try:
                if start_date:
                    queries = queries.filter(start_date__gt=datetime.datetime.strptime(start_date, '%d-%m-%Y')).order_by('-id')
            except:
                queries = queries
            # destination = self.request.query_params.get('destination')
            # destination = Destination.objects.filter(location__icontains=destination)
            # if destination:
            #     queries = queries.filter(destination__in=destination).distinct().order_by('-id')
            cate_id = self.request.query_params.get('cate_id')
            if cate_id:
                queries = queries.filter(tour_category_id=cate_id).order_by('-id')
        return queries

    @action(methods=['post'], url_path='post-comment', detail=True)
    def post_comment(self, request, pk):
        c = self.get_object().commenttour_set.create(content=request.data.get('content'), user=request.user)

        return Response(serializers.CommentTourSerializer(c).data, status=status.HTTP_201_CREATED)


    @action(methods=['get'], url_path='get-comment', detail=True)
    def get_comment(self, request, pk):
        comments = self.get_object().commenttour_set.select_related('user').order_by('-id')

        paginator = paginators.CommentPaginator()
        page = paginator.paginate_queryset(comments, request)
        if page is not None:
            serializer = serializers.CommentTourSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        return Response(serializers.CommentTourSerializer(comments, many=True).data)


    @action(methods=['post'], url_path='post-rating', detail=True)
    def post_rating(self, request, pk):
        rating, created = Rating.objects.update_or_create(tour=self.get_object(), user=request.user)

        if not created:
            rating.stars = request.data.get('stars')
            rating.save()
        else:
            rating.stars = request.data.get('stars')
            rating.save()
        return Response(serializers.RatingSerializer(rating).data)


    @action(methods=['get'], url_path='get-rating', detail=True)
    def get_rating(self, request, pk):
        try:
            rating = Rating.objects.get(tour=self.get_object(), user=request.user)
            return Response(serializers.RatingSerializer(rating).data)
        except:
            return JsonResponse({'stars': 0})



    @action(methods=['post'], url_path='post-booking', detail=True)
    def post_booking(self, request, pk):

        booking, created = Booking.objects.get_or_create(user=request.user, tour=self.get_object(), active=True, defaults={'quantity_ticket_adult':request.data.get('quantity_ticket_adult'), 'quantity_ticket_children':request.data.get('quantity_ticket_children')})

        if not created:
            return JsonResponse({'content': 'Ban da dat ve cho tour nay roi. Vui long huy ve de dat lai!', 'status': 406})
        return Response(serializers.BookingSerializer(booking).data, status=status.HTTP_200_OK)


    @action(methods=['post'], url_path='post-tour', detail=False)
    def post_tour(self, request):
        t = Tour.objects.create(name=request.data.get('name'), description=request.data.get('description'),
                        price_adult=request.data.get('adult'), price_children=request.data.get('children'),
                        quantity_ticket=request.data.get('quantity'), tour_category_id=request.data.get('cate_id'),
                                start_date=datetime.datetime.strptime(request.data.get('start_date'), '%d/%m/%Y'),
                                end_date=datetime.datetime.strptime(request.data.get('end_date'), '%d/%m/%Y'))
        t.tour_image.add(request.data.get('image_id'))
        t.save()
        d = Destination.objects.create(name=request.data.get('desName'), location=request.data.get('desLocation'))
        t.destination.add(d)
        t.save()

        return Response(status=status.HTTP_201_CREATED)


    @action(methods=['put'], url_path='put-tour', detail=False)
    def put_tour(self, request):
        t = Tour.objects.filter(id=request.data.get('id'))
        t.update(name=request.data.get('name'), description=request.data.get('description'),
                                price_adult=request.data.get('adult'), price_children=request.data.get('children'),
                                quantity_ticket=request.data.get('quantity'),
                                tour_category_id=request.data.get('cate_id'),
                                start_date=datetime.datetime.strptime(request.data.get('start_date'), '%d/%m/%Y'),
                                end_date=datetime.datetime.strptime(request.data.get('end_date'), '%d/%m/%Y'))

        return Response(status=status.HTTP_200_OK)


class TourCategoryViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = TourCategory.objects.filter(active=True)
    serializer_class = serializers.TourCategorySerializer


class NewsViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView, generics.DestroyAPIView):

    queryset = News.objects.filter(active=True).order_by('-id')
    serializer_class = serializers.NewsDetailsSerializer
    pagination_class = paginators.NewsPaginator

    def get_queryset(self):
        queries = self.queryset
        if self.action.__eq__('list'):
            cate_id = self.request.query_params.get('cate_id')
            if cate_id:
                queries = queries.filter(news_category_id=cate_id).order_by('-id')
        return queries

    def get_permissions(self):
        if self.action in ['post_like', 'get_like', 'post_comment']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]


    def get_serializer_class(self):
        if self.request.user.is_authenticated:
            return serializers.TourRating
        return self.serializer_class

    @action(methods=['get'], url_path='get-comment', detail=True)
    def get_comment(self, request, pk):
        comments = self.get_object().commentnews_set.select_related('user').order_by('-id')

        paginator = paginators.CommentPaginator()
        page = paginator.paginate_queryset(comments, request)
        if page is not None:
            serializer = serializers.CommentNewsSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)

        return Response(serializers.CommentNewsSerializer(comments, many=True).data)

    @action(methods=['post'], url_path='post-comment', detail=True)
    def post_comment(self, request, pk):
        c = self.get_object().commentnews_set.create(content=request.data.get('content'), user=request.user)

        return Response(serializers.CommentNewsSerializer(c).data, status=status.HTTP_201_CREATED)

    @action(methods=['get'], url_path='get-like', detail=True)
    def get_like(self, request, pk):
        try:
            like = Like.objects.get(user=request.user, news=self.get_object())
            return Response(serializers.LikeSerializer(like).data)
        except:
            return JsonResponse({"active": False})

    @action(methods=['post'], url_path='post-like', detail=True)
    def post_like(self, request, pk):
        like, created = Like.objects.get_or_create(news=self.get_object(), user=request.user)

        if not created:
            like.active = not like.active
            like.save()

        return Response(serializers.LikeSerializer(like).data)

    @action(methods=['post'], url_path='post-news', detail=False)
    def post_news(self, request):
        n = News.objects.create(content=request.data.get('content'), title=request.data.get('title'), admin_id=request.data.get('admin_id'), news_category_id=request.data.get('cate_id'))
        n.news_image.add(request.data.get('newsimage_id'))
        n.save()

        return Response(serializers.NewsSerializer(n).data, status=status.HTTP_201_CREATED)


    @action(methods=['put'], url_path='put-news', detail=False)
    def put_news(self, request):
        n = News.objects.filter(id=request.data.get('id'))
        n.update(content=request.data.get('content'), title=request.data.get('title'),
                                admin_id=request.data.get('admin_id'), news_category_id=request.data.get('cate_id'))
        # n.news_image.add(request.data.get('newsimage_id'))
        # n.save()


        return Response(status=status.HTTP_200_OK)


class NewsCategoryViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = NewsCategory.objects.filter(active=True)
    serializer_class = serializers.NewsCategorySerializer


class UserViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView):
    queryset = User.objects.filter(is_active=True)
    serializer_class = serializers.UserSerializer
    parser_classes = [parsers.MultiPartParser, ]

    def get_permissions(self):
        if self.action in ['get_current_user', 'get_booking']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    @action(methods=['get', 'put'], url_path='current-user', detail=False)
    def get_current_user(self, request):
        user = request.user
        if request.method.__eq__('PUT'):
            for k, v in request.data.items():
                setattr(user, k, v)
            user.save()

        return Response(serializers.UserInfoSerializer(user).data)

    @action(methods=['get'], url_path='get-booking', detail=False)
    def get_booking(self, request):
        booking = Booking.objects.filter(user=request.user, active=True).all()
        total = 0
        for b in booking:
            tour = Tour.objects.get(id=b.tour_id)
            total = total + int(tour.price_adult) * int(b.quantity_ticket_adult) + int(tour.price_children) * int(b.quantity_ticket_children)
        return JsonResponse({'results': serializers.BookingSerializer(booking, many=True).data, 'total': total})


class BookingViewSet(viewsets.ViewSet, generics.DestroyAPIView):
    queryset = Booking.objects.all()

    @action(methods=['post'], url_path='pay', detail=False)
    def pay(self, request):
        booking = Booking.objects.filter(user_id=request.data.get('user_id'))
        for b in booking:
            b.active = False
            b.save()
        bill = Bill.objects.create(user_id=request.data.get('user_id'), total_price=request.data.get('total'))

        return Response(status=status.HTTP_200_OK)


class CommentTourViewSet(viewsets.ViewSet, generics.DestroyAPIView):
    queryset = CommentTour.objects.all()

    @action(methods=['put'], url_path='patch-comment-tour', detail=False)
    def patch_comment_tour(self, request):
        CommentTour.objects.filter(id=request.data.get('id')).update(content=request.data.get('content'))

        return Response(status=status.HTTP_200_OK)


class CommentNewsViewSet(viewsets.ViewSet, generics.DestroyAPIView):
    queryset = CommentNews.objects.all()

    @action(methods=['put'], url_path='patch-comment-news', detail=False)
    def patch_comment_tour(self, request):
        CommentNews.objects.filter(id=request.data.get('id')).update(content=request.data.get('content'))

        return Response(status=status.HTTP_200_OK)


class CustomerViewSet(viewsets.ViewSet):
    queryset = Customer.objects.all()

    @action(methods=['post'], url_path='post-customer', detail=False)
    def post_customer(self, request):
        c = Customer.objects.create(phone=request.data.get('phone'), address=request.data.get('address'), user_id=request.data.get('user_id'))
        return Response(status=status.HTTP_201_CREATED)

    @action(methods=['put'], url_path='put-customer', detail=False)
    def put_customer(self, request):
        c = Customer.objects.filter(user_id=request.data.get('user_id')).update(phone=request.data.get('phone'), address=request.data.get('address'))
        return Response(status=status.HTTP_200_OK)


class TourImageViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = TourImage.objects.all()
    serializer_class = serializers.TourImageSerializer


class NewsImageViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = NewsImage.objects.all()
    serializer_class = serializers.NewsImageSerializer