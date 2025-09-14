-- Insert demo user records
INSERT INTO users (username, password, email, role, enabled, created_at) VALUES ('admin', 'password', 'admin@bank.com', 'ADMIN', true, CURRENT_TIMESTAMP);
INSERT INTO users (username, password, email, role, enabled, created_at) VALUES ('manager1', 'password', 'manager1@bank.com', 'MANAGER', true, CURRENT_TIMESTAMP);
INSERT INTO users (username, password, email, role, enabled, created_at) VALUES ('customer1', 'password', 'customer1@example.com', 'CUSTOMER', true, CURRENT_TIMESTAMP);
INSERT INTO users (username, password, email, role, enabled, created_at) VALUES ('employee1', 'password', 'employee1@bank.com', 'EMPLOYEE', true, CURRENT_TIMESTAMP);

-- Note: All passwords are 'password' (plain text - not recommended for production)
