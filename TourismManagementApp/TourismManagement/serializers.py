from rest_framework import serializers
from .models import *
from rest_framework.response import Response

class ItemSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['image'] = instance.image.url

        return rep


class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = ['id', 'name', 'location']


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['stars']


class TourSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tour
        fields = ['id', 'name', 'start_date', 'end_date', 'description', 'price_adult', 'price_children', 'tour_category_id']


class TourImageSerializer(ItemSerializer):
    class Meta:
        model = TourImage
        fields = ['id', 'name', 'image']

class TourDetailsSerializer(TourSerializer):
    tour_image = TourImageSerializer(many=True)
    destination = DestinationSerializer(many=True)

    remain_ticket = serializers.SerializerMethodField()

    def get_remain_ticket(self, tour):
        book = Booking.objects.filter(tour_id=tour.id)
        if book:
            remain = tour.quantity_ticket
            for b in book:
                remain = remain - b.quantity_ticket_adult - b.quantity_ticket_children
            return remain
        return tour.quantity_ticket


    class Meta:
        model = TourSerializer.Meta.model
        fields = TourSerializer.Meta.fields + ['tour_image'] + ['destination'] + ['remain_ticket']


class TourRating(TourDetailsSerializer):
    rating = serializers.SerializerMethodField()

    def get_rating(self, tour):
        return tour.rating_set.filter(active=True).exists()

    class Meta:
        model = TourDetailsSerializer.Meta.model
        fields = TourDetailsSerializer.Meta.fields + ['rating']


class TourCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TourCategory
        fields = ['id', 'name']


class NewsImageSerializer(ItemSerializer):
    class Meta:
        model = NewsImage
        fields = ['id', 'name', 'image']

class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = ['id', 'title', 'content', 'news_category_id']


class NewsDetailsSerializer(NewsSerializer):
    news_image = NewsImageSerializer(many=True)

    class Meta:
        model = NewsSerializer.Meta.model
        fields = NewsSerializer.Meta.fields + ['news_image']

class NewsCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsCategory
        fields = ['id', 'name']


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['active']



class UserSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['avatar'] = instance.avatar.url

        return rep

    def create(self, validated_data):
        data = validated_data.copy()
        user = User(**data)
        user.set_password(data["password"])
        user.save()

        return user
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'first_name', 'last_name', 'avatar', 'email', 'is_superuser', 'is_staff']
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }


class UserInfoSerializer(UserSerializer):
    info = serializers.SerializerMethodField()

    def get_info(self, user):
        if user.is_superuser == True:
            c = Admin.objects.get(user_id=user.id)
            return {'address': c.address, 'phone': c.phone}
        elif user.is_staff == True:
            c = Staff.objects.get(user_id=user.id)
            return {'address': c.address, 'phone': c.phone}
        else:
            c = Customer.objects.get(user_id=user.id)
            return {'address': c.address, 'phone': c.phone}

    class Meta:
        model = UserSerializer.Meta.model
        fields = UserSerializer.Meta.fields + ['info']



class CommentTourSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = CommentTour
        fields = ['id', 'updated_date', 'content', 'user', 'tour_id']


class CommentNewsSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = CommentNews
        fields = ['id', 'updated_date', 'content', 'user', 'news_id']


class BookingSerializer(serializers.ModelSerializer):
    total = serializers.SerializerMethodField()
    tour_name = serializers.SerializerMethodField()

    def get_tour_name(self, booking):
        tour = Tour.objects.get(id=booking.tour_id)
        return tour.name

    def get_total(self, booking):
        tour = Tour.objects.get(id=booking.tour_id)
        return int(tour.price_adult) * int(booking.quantity_ticket_adult) + int(tour.price_children) * int(booking.quantity_ticket_children)
    class Meta:
        model = Booking
        fields = ['id', 'quantity_ticket_adult', 'quantity_ticket_children'] + ['total'] + ['tour_name']














