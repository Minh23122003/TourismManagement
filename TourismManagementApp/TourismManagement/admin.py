import cloudinary
from django.contrib import admin
from django.utils.html import mark_safe
from TourismManagement.models import *
from django import forms
from ckeditor_uploader.widgets import CKEditorUploadingWidget


class NewsForm(forms.ModelForm):
    description = forms.CharField(widget=CKEditorUploadingWidget)

    class Meta:
        model = News
        fields = '__all__'


class MyNewsAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'created_date', 'updated_date', 'active']
    search_fields = ['name', 'description']
    list_filter = ['id', 'created_date', 'name']
    readonly_fields = ['my_image']
    form = NewsForm

    def my_image(self, instance):
        if instance:
            if instance.image is cloudinary.CloudinaryResource:
                return mark_safe(f"<img width='120' src='{instance.image.url}' />")

            return mark_safe(f"<img width='120' src='/static/{instance.image.name}' />")

    class Media:
        css = {
            'all': ('/static/css/style.css', )
        }


admin.site.register(Admin)
admin.site.register(Staff)
admin.site.register(Customer)
admin.site.register(User)
admin.site.register(TourCategory)
admin.site.register(Tour)
admin.site.register(TourImage)
admin.site.register(Destination)
admin.site.register(Bill)
admin.site.register(Rating)
admin.site.register(CommentTour)
admin.site.register(NewsCategory)
admin.site.register(News)
admin.site.register(NewsImage)
admin.site.register(Like)
admin.site.register(CommentNews)
admin.site.register(Report)
admin.site.register(Booking)