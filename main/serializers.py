from rest_framework import serializers
from .models import User
from .models import Job, Company

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'password']

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name', 'email']

class JobSerializer(serializers.ModelSerializer):
    company = CompanySerializer()  # Nested serializer to include company info
    class Meta:
        model = Job
        fields = ['id', 'title', 'description', 'company']
