.PHONY: help start stop start-backend start-frontend stop-backend stop-frontend status clean-db logs

CONDA_ENV = ET_AI

help:
	@echo "Available commands:"
	@echo "  make start          - Start both backend and frontend servers in the background"
	@echo "  make stop           - Stop both backend and frontend servers"
	@echo "  make status         - Check status of both servers"
	@echo "  make logs           - View logs of running servers"
	@echo "  make clean-db       - Reset SQLite alert database"

start: start-backend start-frontend

stop: stop-backend stop-frontend

start-backend:
	@if [ -f api.pid ] && kill -0 $$(cat api.pid) 2>/dev/null; then \
		echo "Backend is already running."; \
	else \
		echo "Starting Backend..."; \
		conda run -n $(CONDA_ENV) uvicorn api.server:app --host 0.0.0.0 --port 8000 > backend.log 2>&1 & echo $$! > api.pid; \
		sleep 1; \
		echo "Backend started (PID: $$(cat api.pid))."; \
	fi

start-frontend:
	@if [ -f web.pid ] && kill -0 $$(cat web.pid) 2>/dev/null; then \
		echo "Frontend is already running."; \
	else \
		echo "Starting Frontend..."; \
		(cd kawach-web && conda run -n $(CONDA_ENV) npm run dev -- --host > ../frontend.log 2>&1) & echo $$! > web.pid; \
		sleep 1; \
		echo "Frontend started (PID: $$(cat web.pid))."; \
	fi

stop-backend:
	@if [ -f api.pid ]; then \
		PID=$$(cat api.pid); \
		echo "Stopping Backend (PID: $$PID)..."; \
		kill $$PID 2>/dev/null || true; \
		rm -f api.pid; \
		echo "Backend stopped."; \
	else \
		echo "Backend is not running."; \
	fi

stop-frontend:
	@if [ -f web.pid ]; then \
		PID=$$(cat web.pid); \
		echo "Stopping Frontend (PID: $$PID)..."; \
		kill $$PID 2>/dev/null || true; \
		rm -f web.pid; \
		echo "Frontend stopped."; \
	else \
		echo "Frontend is not running."; \
	fi

status:
	@if [ -f api.pid ] && kill -0 $$(cat api.pid) 2>/dev/null; then \
		echo "Backend: RUNNING (PID: $$(cat api.pid))"; \
	else \
		echo "Backend: STOPPED"; \
	fi
	@if [ -f web.pid ] && kill -0 $$(cat web.pid) 2>/dev/null; then \
		echo "Frontend: RUNNING (PID: $$(cat web.pid))"; \
	else \
		echo "Frontend: STOPPED"; \
	fi

logs:
	@echo "=== Showing last 10 lines of Backend Log ==="
	@tail -n 10 backend.log 2>/dev/null || echo "No backend logs found."
	@echo ""
	@echo "=== Showing last 10 lines of Frontend Log ==="
	@tail -n 10 frontend.log 2>/dev/null || echo "No frontend logs found."

clean-db:
	@echo "Resetting SQLite database..."
	@rm -f data/kawach.db
	@echo "Database deleted. It will be recreated on next backend start."
