from django.contrib import admin
from .models import Job, User, Company  # Import all your models

# Register models so they appear in Django admin
admin.site.register(User)
admin.site.register(Company)
admin.site.register(Job)


