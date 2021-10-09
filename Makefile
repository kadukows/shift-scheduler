htmlcov/index.html: .coverage
	coverage html --omit="api/migrations/*,api/tests/*"

.coverage: $(shell find api/tests -type f) 
	coverage run --source='./api/' manage.py test api