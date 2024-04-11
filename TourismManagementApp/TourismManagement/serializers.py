from rest_framework import serializers
from TourismManagement.models import *


class TourSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tour
        fields = '__all__'