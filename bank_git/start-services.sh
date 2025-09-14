#!/bin/bash

echo "Starting Bank Management System Services..."

# Navigate to the project directory
cd /workspace/bank_git/bms/bank-management-system

# Function to start a service in background
start_service() {
    local service_name=$1
    local port=$2
    echo "Starting $service_name on port $port..."
    cd $service_name
    mvn spring-boot:run > ../logs/$service_name.log 2>&1 &
    echo $! > ../logs/$service_name.pid
    cd ..
    sleep 5
}

# Create logs directory
mkdir -p logs

# Start Eureka Server first
echo "Starting Eureka Server..."
cd eureka-server
mvn spring-boot:run > ../logs/eureka-server.log 2>&1 &
echo $! > ../logs/eureka-server.pid
cd ..
echo "Eureka Server started. Waiting 30 seconds for it to initialize..."
sleep 30

# Start all microservices
start_service "auth-service" "8084"
start_service "customer-service" "8082"
start_service "employee-service" "8081"
start_service "account-service" "8083"

echo "All services started!"
echo "Eureka Server: http://localhost:8761"
echo "Auth Service: http://localhost:8084"
echo "Customer Service: http://localhost:8082"
echo "Employee Service: http://localhost:8081"
echo "Account Service: http://localhost:8083"
echo ""
echo "Check logs in the logs/ directory for any issues."
echo "To stop all services, run: ./stop-services.sh"