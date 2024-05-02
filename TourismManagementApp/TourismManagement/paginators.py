from rest_framework import pagination


class NewsPaginator(pagination.PageNumberPagination):
    page_size = 5