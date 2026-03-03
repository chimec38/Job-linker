# views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User, Job, Company
from .serializers import UserSerializer, JobSerializer, CompanySerializer


# ------------------------
# User Auth APIs
# ------------------------
@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'User created successfully'})
    return Response(serializer.errors, status=400)


@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    try:
        user = User.objects.get(email=email, password=password)
        return Response({'message': 'Login successful', 'user': UserSerializer(user).data})
    except User.DoesNotExist:
        return Response({'error': 'Invalid credentials'}, status=400)


# ------------------------
# Jobs APIs
# ------------------------
@api_view(['GET'])
def list_jobs(request):
    all_jobs = Job.objects.all()
    serializer = JobSerializer(all_jobs, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def create_job(request):
    company_data = request.data.pop('company', None)
    if not company_data:
        return Response({'error': 'Company data is required'}, status=400)

    # Create or get the company
    company_serializer = CompanySerializer(data=company_data)
    if company_serializer.is_valid():
        company = company_serializer.save()
        job_serializer = JobSerializer(data={**request.data, "company": company.id})
        if job_serializer.is_valid():
            job_serializer.save()
            return Response({'message': 'Job created successfully'})
        return Response(job_serializer.errors, status=400)
    return Response(company_serializer.errors, status=400)
