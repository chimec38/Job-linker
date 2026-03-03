from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth.password_validation import validate_password


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )

    class Meta:
        model = CustomUser
        fields = ('email', 'username', 'password', 'password2', 'user_type')
        extra_kwargs = {
            'username': {'required': False},
            'user_type': {'required': False, 'default': 'user'}
        }

    def validate(self, attrs):
        # Check if passwords match
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        # Validate password strength
        try:
            validate_password(attrs['password'])
        except Exception as e:
            raise serializers.ValidationError({"password": list(e)})

        # Generate username from email if not provided
        if not attrs.get('username'):
            attrs['username'] = attrs['email'].split('@')[0]

        return attrs

    def create(self, validated_data):
        # Remove password2 from validated data
        validated_data.pop('password2')

        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            username=validated_data.get('username'),
            password=validated_data['password'],
            user_type=validated_data.get('user_type', 'user')
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'username', 'user_type', 'first_name', 'last_name', 'date_joined')