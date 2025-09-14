# Bank Management System

A full-stack banking application built with Angular frontend and Spring Boot microservices backend.

## Architecture

### Backend (Microservices)
- **Eureka Server** (Port 8761) - Service Discovery
- **Auth Service** (Port 8084) - Authentication & Authorization
- **Customer Service** (Port 8082) - Customer Management
- **Employee Service** (Port 8081) - Employee Management
- **Account Service** (Port 8083) - Banking Operations

### Frontend
- **Angular 15** - Modern web application
- **Port 4200** - Development server

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- Node.js 16 or higher
- npm or yarn

## Quick Start

### 1. Start Backend Services

```bash
cd /workspace/bank_git
./start-services.sh
```

This will start all microservices in the correct order:
1. Eureka Server (30 second delay)
2. Auth Service
3. Customer Service
4. Employee Service
5. Account Service

### 2. Start Frontend

```bash
cd /workspace/bank_git/new_frontend/frontend
npm install
npm start
```

The frontend will be available at `http://localhost:4200`

### 3. Access Services

- **Frontend**: http://localhost:4200
- **Eureka Dashboard**: http://localhost:8761
- **Auth Service API**: http://localhost:8084
- **Customer Service API**: http://localhost:8082
- **Employee Service API**: http://localhost:8081
- **Account Service API**: http://localhost:8083

## Stopping Services

### Stop Backend Services
```bash
cd /workspace/bank_git
./stop-services.sh
```

### Stop Frontend
Press `Ctrl+C` in the terminal running the Angular development server.

## Demo Credentials

### Customer Login
- **SSN**: 1234567
- **Password**: password123

### Employee Login
- **Username**: employee1
- **Password**: Employee123

### Manager Login
- **Username**: manager1
- **Password**: Manager123

## Features

### Customer Features
- Account Registration
- Profile Management
- Deposit Money
- Withdraw Money
- Transfer Money
- Transaction History
- Account Balance

### Employee Features
- Customer Management
- View All Customers
- Create/Update/Delete Customers
- Employee Management

### Manager Features
- All Employee Features
- Employee Salary Management
- Advanced Reporting

## API Endpoints

### Auth Service (Port 8084)
- `POST /api/auth/register` - User Registration
- `POST /api/auth/login` - User Login
- `POST /api/auth/logout` - User Logout
- `GET /api/auth/session` - Get Current Session
- `GET /api/auth/users` - Get All Users

### Customer Service (Port 8082)
- `GET /api/customers` - Get All Customers
- `POST /api/customers` - Create Customer
- `GET /api/customers/{ssnId}` - Get Customer by SSN
- `PUT /api/customers/{ssnId}` - Update Customer
- `DELETE /api/customers/{ssnId}` - Delete Customer

### Account Service (Port 8083)
- `POST /api/accounts/{accountNumber}/deposit` - Deposit Money
- `POST /api/accounts/{accountNumber}/withdraw` - Withdraw Money
- `POST /api/accounts/transfer` - Transfer Money
- `GET /api/accounts/{accountNumber}/transactions` - Get Transactions

### Employee Service (Port 8081)
- `GET /api/employees` - Get All Employees
- `POST /api/employees` - Create Employee
- `PUT /api/employees/{id}` - Update Employee
- `DELETE /api/employees/{id}` - Delete Employee

## Troubleshooting

### Common Issues

1. **CORS Errors**: All services have CORS configured to allow all origins
2. **Service Discovery Issues**: Ensure Eureka Server starts first and wait 30 seconds
3. **Port Conflicts**: Check if ports 8081-8084 and 8761 are available
4. **Database Issues**: All services use in-memory H2 databases

### Logs

Check service logs in `/workspace/bank_git/bms/bank-management-system/logs/`:
- `eureka-server.log`
- `auth-service.log`
- `customer-service.log`
- `employee-service.log`
- `account-service.log`

### Manual Service Start

If the startup script fails, start services manually:

```bash
# Terminal 1 - Eureka Server
cd /workspace/bank_git/bms/bank-management-system/eureka-server
mvn spring-boot:run

# Terminal 2 - Auth Service
cd /workspace/bank_git/bms/bank-management-system/auth-service
mvn spring-boot:run

# Terminal 3 - Customer Service
cd /workspace/bank_git/bms/bank-management-system/customer-service
mvn spring-boot:run

# Terminal 4 - Employee Service
cd /workspace/bank_git/bms/bank-management-system/employee-service
mvn spring-boot:run

# Terminal 5 - Account Service
cd /workspace/bank_git/bms/bank-management-system/account-service
mvn spring-boot:run
```

## Development

### Backend Development
- All services use Spring Boot 3.1.5
- Java 17 is required
- Maven for dependency management
- H2 in-memory database for development

### Frontend Development
- Angular 15 with standalone components
- Reactive Forms for form handling
- RxJS for HTTP operations
- Modern CSS with responsive design

## Security

- Session-based authentication
- CORS enabled for all origins (development only)
- Password validation
- Role-based access control

## Database

All services use H2 in-memory databases with the following schemas:
- `authdb` - User authentication data
- `customerdb` - Customer information
- `employeedb` - Employee information
- `accountdb` - Banking transactions

Data is reset on each service restart.