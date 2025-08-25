DEV=docker/development/compose.yaml
PROD=docker/production/compose.yaml

start:
	./start.sh

dev:
	docker compose -f $(DEV) up -d --build

stop-dev:
	docker compose -f $(DEV) down

prod:
	docker compose -f $(PROD) up -d --build

stop-prod:.
	docker compose -f $(PROD) down

.PHONY: dev stop-dev prod stop-prod