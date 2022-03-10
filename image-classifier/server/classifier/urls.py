from django.urls import path
from .views import ClassifierViews

urlpatterns = [
    path('classifier/', ClassifierViews.as_view())
]