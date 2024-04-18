from django.db import models
from django.contrib.auth.models import AbstractUser
from ckeditor.fields import RichTextField
from cloudinary.models import CloudinaryField


class User(AbstractUser):
    avatar = CloudinaryField(null=False)


class Admin(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=100)
    phone = models.CharField(max_length=10)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Staff(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=100)
    phone = models.CharField(max_length=10)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Customer(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=100)
    phone = models.CharField(max_length=10)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class BaseModel(models.Model):
    created_date = models.DateTimeField(auto_now_add=True, null=True)
    updated_date = models.DateTimeField(auto_now=True, null=True)
    active = models.BooleanField(default=True)

    class Meta:
        abstract = True


class TourCategory(BaseModel):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Destination(BaseModel):
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=100)

    def __str__(self):
        return f'{self.name} - {self.location}'


class Tour(BaseModel):
    name = models.CharField(max_length=150)
    start_date = models.DateTimeField(null=False)
    end_date = models.DateTimeField(null=False)
    description = RichTextField()
    price_adult = models.IntegerField()
    price_children = models.IntegerField()
    tour_category = models.ForeignKey(TourCategory, on_delete=models.CASCADE)
    destination = models.ManyToManyField(Destination)

    def __str__(self):
        return self.name


class Booking(BaseModel):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE)
    is_adult = models.BooleanField()

    def __str__(self):
        return f'{self.customer_id} - {self.tour_id}'


class TourImage(BaseModel):
    name = models.CharField(max_length=100)
    image = CloudinaryField(null=False)
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Bill(BaseModel):
    total_price = models.IntegerField()
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.customer_id}'


class Rating(BaseModel):
    stars = models.IntegerField()
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.customer_id} - {self.tour_id}'


class CommentTour(BaseModel):
    content = models.CharField(max_length=200)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.customer_id} - {self.tour_id}'


class NewsCategory(BaseModel):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class News(BaseModel):
    title = models.CharField(max_length=100)
    content = RichTextField()
    news_category = models.ForeignKey(NewsCategory, on_delete=models.CASCADE)
    admin = models.ForeignKey(Admin, on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class NewsImage(BaseModel):
    name = models.CharField(max_length=100, null=False)
    image = CloudinaryField(null=False)
    news = models.ForeignKey(News, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Like(BaseModel):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    news = models.ForeignKey(News, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('customer', 'news')

    def __str__(self):
        return f'{self.customer_id} - {self.news_id}'


class CommentNews(BaseModel):
    content = models.CharField(max_length=200)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    news = models.ForeignKey(News, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.customer_id} - {self.news_id}'


class Report(BaseModel):
    quantity_tour = models.IntegerField()
    revenue = models.IntegerField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    admin = models.ForeignKey(Admin, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.start_date)
