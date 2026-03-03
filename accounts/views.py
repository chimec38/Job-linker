from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer

# Use get_user_model() to get the correct user model
User = get_user_model()


class RegisterView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        print("=" * 50)
        print("📝 REGISTER ATTEMPT - FULL DEBUG")
        print("=" * 50)
        print(f"Full request data: {request.data}")
        print(f"Email: {request.data.get('email')}")
        print(f"Password length: {len(request.data.get('password', ''))}")
        print(f"User type from request: '{request.data.get('user_type', 'user')}'")

        email = request.data.get('email')
        password = request.data.get('password')
        user_type = request.data.get('user_type', 'user')  # Default to 'user'

        if not email or not password:
            return Response({
                'error': 'Email and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Validate user_type
        valid_types = ['user', 'company']
        if user_type not in valid_types:
            print(f"⚠️ Invalid user_type '{user_type}', defaulting to 'user'")
            user_type = 'user'

        print(f"✓ Using user_type: '{user_type}'")

        if User.objects.filter(email=email).exists():
            print(f"✗ User already exists with email: {email}")
            return Response({
                'error': 'User with this email already exists'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Create user
        try:
            print(f"Creating user with email: {email}, type: '{user_type}'")

            # Generate username from email if needed
            username = email.split('@')[0]
            # Make sure username is unique
            counter = 1
            original_username = username
            while User.objects.filter(username=username).exists():
                username = f"{original_username}{counter}"
                counter += 1

            user = User.objects.create_user(
                email=email,
                username=username,
                password=password,
                user_type=user_type
            )

            print(f"✓ User created successfully! ID: {user.id}")
            print(f"✓ Email: {user.email}")
            print(f"✓ Username: {user.username}")
            print(f"✓ User type saved in DB: '{user.user_type}'")

            # Verify the save
            user.refresh_from_db()
            print(f"✓ After refresh - User type: '{user.user_type}'")

        except Exception as e:
            print(f"✗ Error creating user: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response({
                'error': f'Failed to create user: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Generate tokens
        refresh = RefreshToken.for_user(user)

        response_data = {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'role': user.user_type,
                'user_type': user.user_type
            }
        }

        print(f"✓ Returning response: {response_data}")
        print("=" * 50)

        return Response(response_data, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        print("=" * 50)
        print("🔐 LOGIN ATTEMPT - DEBUG")
        print("=" * 50)
        print(f"Request data: {request.data}")

        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({
                'error': 'Email and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
            print(f"✓ User found: {user.email}")
            print(f"✓ User type in DB: '{user.user_type}'")
            print(f"✓ Is active: {user.is_active}")

            if not user.check_password(password):
                print(f"✗ Password incorrect")
                return Response({
                    'error': 'Invalid email or password'
                }, status=status.HTTP_400_BAD_REQUEST)

            if not user.is_active:
                print(f"✗ User not active")
                return Response({
                    'error': 'Account is not active'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Generate tokens
            refresh = RefreshToken.for_user(user)

            response_data = {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'role': user.user_type,
                    'user_type': user.user_type
                }
            }

            print(f"✓ Login successful!")
            print(f"✓ Returning user_type: '{user.user_type}'")
            print("=" * 50)

            return Response(response_data)

        except User.DoesNotExist:
            print(f"✗ User not found with email: {email}")
            return Response({
                'error': 'Invalid email or password'
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"✗ Unexpected error: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response({
                'error': f'Login failed: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user