#!/bin/bash

echo "Stopping Bank Management System Services..."

cd /workspace/bank_git/bms/bank-management-system/logs

# Stop all services
for pid_file in *.pid; do
    if [ -f "$pid_file" ]; then
        service_name=$(basename "$pid_file" .pid)
        pid=$(cat "$pid_file")
        if kill -0 "$pid" 2>/dev/null; then
            echo "Stopping $service_name (PID: $pid)..."
            kill "$pid"
            rm "$pid_file"
        else
            echo "$service_name is not running"
            rm "$pid_file"
        fi
    fi
done

echo "All services stopped!"