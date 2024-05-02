from rest_framework import serializers
from .models import *
from rest_framework.decorators import action
from rest_framework.response import Response


class ItemSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['image'] = instance.image.url

        return rep


class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        exclude = ['user']


class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff
        exclude = ['user']

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        exclude = ['user']

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'


class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = '__all__'


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = '__all__'


class CommentTourSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentTour
        fields = '__all__'


class TourSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tour
        fields = ['id', 'name', 'start_date', 'end_date', 'description', 'price_adult', 'price_children']


class TourImageSerializer(ItemSerializer):
    class Meta:
        model = TourImage
        fields = ['id', 'name', 'image']

class TourDetailsSerializer(TourSerializer):
    tour_image = TourImageSerializer(many=True)

    class Meta:
        model = TourSerializer.Meta.model
        fields = TourSerializer.Meta.fields + ['tour_image']


class TourCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TourCategory
        fields = ['id', 'name']


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'


class BillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bill
        fields = '__all__'


class CommentNewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentNews
        fields = '__all__'


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = '__all__'


class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = News
        fields = '__all__'


class NewsImageSerializer(ItemSerializer):
    class Meta:
        model = NewsImage
        fields = '__all__'


class NewsCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsCategory
        fields = '__all__'








