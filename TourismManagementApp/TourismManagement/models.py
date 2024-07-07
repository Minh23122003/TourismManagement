from unittest.mock import Base

from django.db import models
from django.contrib.auth.models import AbstractUser
from ckeditor.fields import RichTextField
from cloudinary.models import CloudinaryField


class User(AbstractUser):
    avatar = CloudinaryField(null=True)


class BaseModel(models.Model):
    created_date = models.DateTimeField(auto_now_add=True, null=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)
    active = models.BooleanField(default=True)

    class Meta:
        abstract = True


class Admin(BaseModel):
    address = models.CharField(max_length=110)
    phone = models.CharField(max_length=10)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    # def __str__(self):
    #     return self.id


class Staff(BaseModel):
    address = models.CharField(max_length=100)
    phone = models.CharField(max_length=10)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    # def __str__(self):
    #     return self.id


class Customer(BaseModel):
    address = models.CharField(max_length=100)
    phone = models.CharField(max_length=10)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    # def __str__(self):
    #     return self.id


class TourCategory(BaseModel):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Location(BaseModel):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Destination(BaseModel):
    name = models.CharField(max_length=200)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Tour(BaseModel):
    name = models.CharField(max_length=150)
    start_date = models.DateField(null=False)
    end_date = models.DateField(null=False)
    description = RichTextField()
    quantity_ticket = models.IntegerField()
    tour_category = models.ForeignKey(TourCategory, on_delete=models.CASCADE)
    destination = models.ManyToManyField(Destination)

    def __str__(self):
        return self.name


class TourImage(BaseModel):
    name = models.CharField(max_length=150)
    image = CloudinaryField(null=False)
    tour_id = models.ForeignKey(Tour, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class TypeOfTicket(BaseModel):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Price(BaseModel):
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE)
    type = models.ForeignKey(TypeOfTicket, on_delete=models.CASCADE)
    price = models.IntegerField()

    # def __str__(self):
    #     return self.id


class Booking(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    price = models.ForeignKey(Price, on_delete=models.CASCADE)
    quantity = models.IntegerField()

    def __str__(self):
        return f'{self.user_id} - {self.price_id}'


class Bill(BaseModel):
    total_price = models.IntegerField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.user_id}'


class Rating(BaseModel):
    stars = models.FloatField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.user_id} - {self.tour_id}'


class CommentTour(BaseModel):
    content = models.CharField(max_length=200)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.user_id} - {self.tour_id}'


class NewsCategory(BaseModel):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name



class News(BaseModel):
    title = models.CharField(max_length=150)
    content = RichTextField()
    news_category = models.ForeignKey(NewsCategory, on_delete=models.CASCADE)
    admin = models.ForeignKey(Admin, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

class NewsImage(BaseModel):
    name = models.CharField(max_length=150, null=False)
    image = CloudinaryField(null=False)
    news_id = models.ForeignKey(News, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Like(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    news = models.ForeignKey(News, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'news')

    def __str__(self):
        return f'{self.user_id} - {self.news_id}'


class CommentNews(BaseModel):
    content = models.CharField(max_length=200)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    news = models.ForeignKey(News, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.user_id} - {self.news_id}'


class Report(BaseModel):
    quantity_tour = models.IntegerField()
    revenue = models.IntegerField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.start_date)