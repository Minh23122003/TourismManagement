from rest_framework import serializers
from .models import *
from rest_framework.decorators import action
from rest_framework.response import Response


class ItemSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['image'] = instance.image.url

        return rep


class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = '__all__'


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = '__all__'


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

    class Meta:
        model = TourSerializer.Meta.model
        fields = TourSerializer.Meta.fields + ['tour_image'] + ['destination']


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



class CommentNewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentNews
        fields = '__all__'


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


class NewsLike(NewsSerializer):
    like = serializers.SerializerMethodField()

    def get_like(self, news):
        return news.like_set.filter(active=True).exists()
    class Meta:
        model = NewsSerializer.Meta.model
        fields = NewsSerializer.Meta.fields + ['like']

class UserSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        rep = super().to_representation((instance))
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
        fields = ['id', 'username', 'password']
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }

class CommentTourSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = CommentTour
        fields = ['id', 'created_date', 'content', 'user', 'tour_id']








