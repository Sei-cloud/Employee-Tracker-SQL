-- Insert sample data into the departments table
INSERT INTO departments (name) VALUES
('Sales'),
('Marketing'),
('Engineering'),
('Human Resources');

-- Insert sample data into the roles table
INSERT INTO roles (title, salary, department_id) VALUES
('Sales Representative', 50000.00, 1),
('Sales Manager', 80000.00, 1),
('Marketing Coordinator', 45000.00, 2),
('Software Engineer', 75000.00, 3),
('Senior Software Engineer', 95000.00, 3),
('HR Coordinator', 48000.00, 4);

-- Insert sample data into the employees table
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, 1),
('Michael', 'Johnson', 3, 2),
('Emily', 'Williams', 4, 3),
('David', 'Brown', 5, 3),
('Sarah', 'Jones', 6, NULL);
