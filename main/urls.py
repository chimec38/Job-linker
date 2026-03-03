from django.urls import path
from .views import signup, login, list_jobs, create_job

urlpatterns = [
    # User authentication
    path('users/signup/', signup, name='signup'),
    path('users/login/', login, name='login'),

    # Jobs endpoints
    path('jobs/', list_jobs, name='list_jobs'),
    path('jobs/create/', create_job, name='create_job'),
]
# project/urls.py
from django.urls import path, include

urlpatterns = [
    path('api/accounts/', include('accounts.urls')),
]
