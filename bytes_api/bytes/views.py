from .serializers import *
from rest_framework import viewsets, permissions, status
from django.contrib.auth import login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.

class AllUsers(viewsets.ViewSet):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication, )
    def list(self, request):
        if not request.query_params:
            queryset=CustomUser.objects.all()
        else:
            queryset=CustomUser.objects.filter(id=int(request.query_params['id']))
        serializer_class=CustomUserSerializer(queryset, many=True)
        return Response(serializer_class.data)

class UserRegister(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request):
        serializer_class = UserRegistrationSerializer(data=request.data)
        if serializer_class.is_valid(raise_exception=True):
            user = serializer_class.create(request.data)
            if user:
                return Response(serializer_class.data, status=status.HTTP_201_CREATED)

        return Response(status=status.HTTP_400_BAD_REQUEST)
class UserLogin(APIView):
    permission_classes = (permissions.AllowAny, )
    authentication_classes = (SessionAuthentication, )

    def post(self, request):
        data = request.data

        serializer_class = UserLoginSerializer(data=data)
        if serializer_class.is_valid(raise_exception=True):
            user = serializer_class.check_user(data)
            login(request, user)
            return Response(serializer_class.data, status=status.HTTP_200_OK)
class UserLogout(APIView):
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)

class UserView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication, )
    def get(self, request):
        serializer_class = CustomUserSerializer(request.user)
        return Response({'user': serializer_class.data} , status=status.HTTP_200_OK)