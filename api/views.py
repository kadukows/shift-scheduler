from django.contrib.auth.models import User
from rest_framework import viewsets, generics, permissions
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token

from .serializers import EmployeeSerializer, UserSerializer, WorkplaceSerializer
from .models import Employee, Workplace
from .helpers import LastModifiedHeaderMixin


class CustomAuthToken(ObtainAuthToken):
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
        })

class UserViewSet(viewsets.GenericViewSet, generics.ListCreateAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    authentication_classes = [TokenAuthentication, SessionAuthentication]

    def get_permissions(self):
        if (self.action == 'create' or self.action == "get_token"):
            permission_classes = []
        else:
            permission_classes = [permissions.IsAuthenticated]

        return [permission() for permission in permission_classes]

    def list(self, request: Request, *args, **kwargs):
        # this is hacky way to only return current user
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    @action(methods=["post"], detail=False, url_path="get_token", url_name="get_token")
    def get_token(self, request: Request, *args, **kwargs):
        auth = CustomAuthToken()
        return auth.post(request, *args, **kwargs)


class WorkplaceViewSet(LastModifiedHeaderMixin, viewsets.ModelViewSet):
    serializer_class = WorkplaceSerializer
    queryset = Workplace.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [TokenAuthentication, SessionAuthentication]

    def get_queryset(self):
        return Workplace.objects.filter(owner=self.request.user).all()


class EmployeeViewSet(LastModifiedHeaderMixin, viewsets.ModelViewSet):
    serializer_class = EmployeeSerializer
    queryset = Employee.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Employee.objects.filter(workplace__owner=self.request.user).all()


'''
class EmployeeViewSet(LastModifiedHeaderMixin, viewsets.ModelViewSet):
    serializer_class = EmployeeSerializer
    queryset = Employee.objects.all()
'''
