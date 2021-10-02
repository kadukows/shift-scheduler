from django.urls import path
from . import views

urlpatterns = [
    path('overflow_grid', views.overflow_grid)
]
