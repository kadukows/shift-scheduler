from rest_framework import viewsets

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
