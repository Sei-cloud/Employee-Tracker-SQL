const inquirer = require('inquirer');
const { Client } = require('pg');

const connection = new Client({
    user: 'sei',
    host: 'localhost',
    database: 'employees_db',
    password: ' ',
    port: 5432,
});

// Connect to the database
connection.connect();

// Main menu prompt
async function mainMenu() {
    try {
        const answer = await inquirer.prompt({
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
        });

        switch (answer.action) {
            case 'View All Departments':
                await viewAllDepartments();
                break;
            case 'View All Roles':
                await viewAllRoles();
                break;
            case 'View All Employees':
                await viewAllEmployees();
                break;
            case 'Add a Department':
                await addDepartment();
                break;
            case 'Add a Role':
                await addRole();
                break;
            case 'Add an Employee':
                await addEmployee();
                break;
            case 'Update an Employee Role':
                await updateEmployeeRole();
                break;
            case 'Exit':
                connection.end();
                console.log('Goodbye!');
                break;
        }
    } catch (error) {
        console.error('Error:', error.stack);
    }
}

// Function to view all departments
async function viewAllDepartments() {
    const { rows } = await connection.query('SELECT * FROM departments');
    console.table(rows);
    mainMenu();
}

// Function to view all roles with department names
async function viewAllRoles() {
    const query = `
        SELECT roles.title AS "Role Title", roles.salary AS "Salary", departments.name AS "Department"
        FROM roles
        INNER JOIN departments ON roles.department_id = departments.id
    `;
    const { rows } = await connection.query(query);
    console.table(rows);
    mainMenu();
}

// Function to view all employees with role and department names
async function viewAllEmployees() {
    const query = `
        SELECT employees.first_name AS "First Name", employees.last_name AS "Last Name",
               roles.title AS "Role", departments.name AS "Department"
        FROM employees
        INNER JOIN roles ON employees.role_id = roles.id
        INNER JOIN departments ON roles.department_id = departments.id
    `;
    const { rows } = await connection.query(query);
    console.table(rows);
    mainMenu();
}

// Function to add a department
async function addDepartment() {
    const answers = await inquirer.prompt({
        type: 'input',
        name: 'name',
        message: 'Enter the name of the department:'
    });

    await connection.query('INSERT INTO departments (name) VALUES ($1)', [answers.name]);
    console.log('Department added successfully!');
    mainMenu();
}

// Function to add a role
async function addRole() {
    const roleAnswers = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter the title of the role:'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary for this role:'
        }
    ]);

    const departments = await connection.query('SELECT * FROM departments');
    const departmentChoices = departments.rows.map(department => ({
        name: department.name,
        value: department.id
    }));

    const departmentAnswer = await inquirer.prompt({
        type: 'list',
        name: 'departmentId',
        message: 'Select the department for this role:',
        choices: departmentChoices
    });

    await connection.query('INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)', [roleAnswers.title, roleAnswers.salary, departmentAnswer.departmentId]);
    console.log('Role added successfully!');
    mainMenu();
}

// Function to add an employee
async function addEmployee() {
    const employeeAnswers = await inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'Enter the first name of the employee:'
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Enter the last name of the employee:'
        }
    ]);

    const roles = await connection.query('SELECT * FROM roles');
    const roleChoices = roles.rows.map(role => ({
        name: role.title,
        value: role.id
    }));

    const roleAnswer = await inquirer.prompt({
        type: 'list',
        name: 'roleId',
        message: 'Select the role for this employee:',
        choices: roleChoices
    });

    const employees = await connection.query('SELECT * FROM employees');
    const managerChoices = employees.rows.map(employee => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id
    }));
    managerChoices.unshift({ name: 'None', value: null });

    const managerAnswer = await inquirer.prompt({
        type: 'list',
        name: 'managerId',
        message: 'Select the manager for this employee:',
        choices: managerChoices
    });

    await connection.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [employeeAnswers.firstName, employeeAnswers.lastName, roleAnswer.roleId, managerAnswer.managerId]);
    console.log('Employee added successfully!');
    mainMenu();
}

// Function to update an employee role
async function updateEmployeeRole() {
    try {
        const employees = await connection.query('SELECT * FROM employees');
        const employeeChoices = employees.rows.map(employee => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id
        }));

        const employeeAnswer = await inquirer.prompt({
            type: 'list',
            name: 'employeeId',
            message: 'Select the employee whose role you want to update:',
            choices: employeeChoices
        });

        const roles = await connection.query('SELECT id, title FROM roles');
        const roleChoices = roles.rows.map(role => ({
            name: role.title,
            value: role.id
        }));

        const roleAnswer = await inquirer.prompt({
            type: 'list',
            name: 'roleId',
            message: 'Select the new role for this employee:',
            choices: roleChoices
        });

        await connection.query('UPDATE employees SET role_id = $1 WHERE id = $2', [roleAnswer.roleId, employeeAnswer.employeeId]);
        console.log('Employee role updated successfully!');
        mainMenu();
    } catch (error) {
        console.error('Error updating employee role:', error.stack);
    }
}


// Start the main menu
mainMenu();
