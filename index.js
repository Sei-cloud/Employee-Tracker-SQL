const inquirer = require('inquirer');
const { Client } = require('pg');

// Create PostgreSQL client
const connection = new Client({
    user: 'sei',
    host: 'localhost',
    database: 'employees_db',
    password: ' ',
    port: 5432, // Default PostgreSQL port
});

// Connect to the database
connection.connect();

// Main menu prompt
function mainMenu() {
    inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
            'View All Departments',
            'View All Roles',
            'View All Employees',
            'Add a Department',
            'Add a Role',
            'Add an Employee',
            'Update an Employee Role',
            'Exit'
        ]
    }).then(answer => {
        switch (answer.action) {
            case 'View All Departments':
                viewAllDepartments();
                break;
            case 'View All Roles':
                viewAllRoles();
                break;
            case 'View All Employees':
                viewAllEmployees();
                break;
            case 'Add a Department':
                addDepartment();
                break;
            case 'Add a Role':
                addRole();
                break;
            case 'Add an Employee':
                addEmployee();
                break;
            case 'Update an Employee Role':
                updateEmployeeRole();
                break;
            case 'Exit':
                connection.end();
                console.log('Goodbye!');
                break;
        }
    });
}

// Function to view all departments
function viewAllDepartments() {
    connection.query('SELECT * FROM departments', (error, results) => {
        if (error) {
            console.error('Error executing query:', error.stack);
            return;
        }
        console.table(results.rows);
        mainMenu();
    });
}

// Function to view all roles
function viewAllRoles() {
    connection.query('SELECT * FROM roles', (error, results) => {
        if (error) {
            console.error('Error executing query:', error.stack);
            return;
        }
        console.table(results.rows);
        mainMenu();
    });
}

// Function to view all employees
function viewAllEmployees() {
    connection.query('SELECT * FROM employees', (error, results) => {
        if (error) {
            console.error('Error executing query:', error.stack);
            return;
        }
        console.table(results.rows);
        mainMenu();
    });
}

// Function to add a department
function addDepartment() {
  
    
}

// Function to add a role
function addRole() {
   
}


// Function to add an employee
function addEmployee() {
    // Prompt the user to enter the details for the employee
}

// Function to update an employee role
function updateEmployeeRole() {
    
}

// Start the main menu
mainMenu();
