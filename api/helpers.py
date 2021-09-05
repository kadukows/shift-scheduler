from typing import Dict, List
from rest_framework import viewsets, serializers

class LastModifiedHeaderMixin:
    @property
    def default_response_headers(self):
        headers = viewsets.ModelViewSet.default_response_headers.fget(self)
        if not self.request.user.is_anonymous and not self.detail:
            if self.detail:
                instance = self.get_object()
            else:
                instance = self.get_queryset().order_by("-created_at").first()
            headers["Last-Modified"] = instance.created_at if instance else None
        return headers


class ReadOnlyUponActionSerializer(serializers.ModelSerializer):
    action_to_ro_fields: Dict[str, List[str]] = {}

    def get_extra_kwargs(self):
        extra_kwargs = super(ReadOnlyUponActionSerializer, self).get_extra_kwargs()
        action = self.context['view'].action

        if action in self.action_to_ro_fields:
            for field in self.action_to_ro_fields[action]:
                kwargs = extra_kwargs.get(field, {})
                kwargs['read_only'] = True
                extra_kwargs[field] = kwargs

        return extra_kwargs
