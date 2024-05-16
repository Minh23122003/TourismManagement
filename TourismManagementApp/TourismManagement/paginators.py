from rest_framework import pagination


class NewsPaginator(pagination.PageNumberPagination):
    page_size = 20

class TourPaginator(pagination.PageNumberPagination):
    page_size = 4