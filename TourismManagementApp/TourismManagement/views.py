from rest_framework import viewsets, generics
from TourismManagement import serializers
from TourismManagement.models import *


class TourViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Tour.objects.filter(active=True)
    serializer_class = serializers.TourSerializer