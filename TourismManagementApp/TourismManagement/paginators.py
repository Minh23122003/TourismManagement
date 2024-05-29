from rest_framework import pagination


class NewsPaginator(pagination.PageNumberPagination):
    page_size = 4


class TourPaginator(pagination.PageNumberPagination):
    page_size = 4


class CommentPaginator(pagination.PageNumberPagination):
    page_size = 10