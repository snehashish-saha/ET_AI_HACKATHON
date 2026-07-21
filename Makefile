.PHONY: help start stop start-backend start-frontend stop-backend stop-frontend status clean-db logs

CONDA_ENV = ETAI

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
	@if [ -f api.pid ] && kill -0 $$(cat api.pid) >/dev/null 2>&1; then \
		echo "Backend is already running or initializing (PID: $$(cat api.pid))."; \
	elif lsof -i :8000 >/dev/null 2>&1; then \
		echo "Backend port 8000 is already in use by another process."; \
	else \
		echo "Starting Backend..."; \
		nohup conda run -n $(CONDA_ENV) uvicorn api.server:app --host 0.0.0.0 --port 8000 > backend.log 2>&1 & echo $$! > api.pid; \
		sleep 1; \
		echo "Backend started (loading models in background)."; \
	fi

start-frontend:
	@if [ -f web.pid ] && kill -0 $$(cat web.pid) >/dev/null 2>&1; then \
		echo "Frontend is already running or initializing (PID: $$(cat web.pid))."; \
	elif lsof -i :5173 >/dev/null 2>&1; then \
		echo "Frontend port 5173 is already in use by another process."; \
	else \
		echo "Starting Frontend..."; \
		cd kawach-web && nohup npm run dev -- --host > ../frontend.log 2>&1 & echo $$! > ../web.pid; \
		sleep 1; \
		echo "Frontend started."; \
	fi

stop-backend:
	@echo "Stopping Backend..."
	@pkill -9 -f "[u]vicorn api.server:app" || true
	@rm -f api.pid
	@echo "Backend stopped."

stop-frontend:
	@echo "Stopping Frontend..."
	@pkill -9 -f "[v]ite" || true
	@rm -f web.pid
	@echo "Frontend stopped."

status:
	@if [ -f api.pid ] && kill -0 $$(cat api.pid) >/dev/null 2>&1; then \
		if lsof -i :8000 >/dev/null 2>&1; then \
			echo "Backend: RUNNING (PID $$(cat api.pid))"; \
		else \
			echo "Backend: INITIALIZING (PID $$(cat api.pid) - loading models...)"; \
		fi; \
	elif lsof -i :8000 >/dev/null 2>&1; then \
		echo "Backend: RUNNING (External Process)"; \
	else \
		echo "Backend: STOPPED"; \
	fi
	@if [ -f web.pid ] && kill -0 $$(cat web.pid) >/dev/null 2>&1; then \
		if lsof -i :5173 >/dev/null 2>&1; then \
			echo "Frontend: RUNNING (PID $$(cat web.pid))"; \
		else \
			echo "Frontend: INITIALIZING (PID $$(cat web.pid))"; \
		fi; \
	elif lsof -i :5173 >/dev/null 2>&1; then \
		echo "Frontend: RUNNING (External Process)"; \
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
