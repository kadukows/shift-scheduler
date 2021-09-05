from typing import Dict, List
from django.db import models
from rest_framework import viewsets, serializers


class LastModifiedBaseModel(models.Model):
    last_modified = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class LastModifiedHeaderMixin:
    @property
    def default_response_headers(self):
        headers = viewsets.ModelViewSet.default_response_headers.fget(self)
        if not self.request.user.is_anonymous:
            if self.detail:
                instance = self.get_object()
            else:
                instance = self.get_queryset().order_by('-last_modified').first()
            headers["Last-Modified"] = instance.last_modified if instance else None
        return headers


class ReadOnlyUponActionSerializerMixin:
    action_to_ro_fields: Dict[str, List[str]] = {}

    def get_extra_kwargs(self):
        extra_kwargs = serializers.ModelSerializer.get_extra_kwargs(self)
        action = self.context['view'].action

        print(f'get_extra_kwargs with action: {action}')

        if action in self.action_to_ro_fields:
            for field in self.action_to_ro_fields[action]:
                print(f'adding read_only to field {field}')
                kwargs = extra_kwargs.get(field, {})
                kwargs['read_only'] = True
                extra_kwargs[field] = kwargs

        return extra_kwargs
