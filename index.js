const mysql = require("mysql2");
const inquirer = require("inquirer");
const util = require("util");

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "roo1234",
  database: "employees_db",
});

const query = util.promisify(db.query).bind(db);

const initialQuestion = [
  {
    type: "list",
    message: "Please choose one.",
    name: "initialUserAction",
    choices: [
      "View Departments",
      "View Roles",
      "View Employees",
      "Add Department",
      "Add Role",
      "Add Employee",
      "Update Employee",
      "Quit",
    ],
  },
];
const init = async () => {
  const { initialUserAction } = await inquirer.prompt(initialQuestion);
  console.log(initialUserAction);
  switch (initialUserAction) {
    case "View Departments":
      viewDepartment();
      break;
    case "View Roles":
      viewRoles();
      break;
    case "View Employees":
      viewEmployees();
      break;
    case "Add Department":
      addDepartment();
      break;
    case "Add Role":
      addRole();
      break;
    case "Add Employee":
      addEmployee();
      break;
    case "Update Employee":
      updateEmployee();
      break;
    case "Quit":
      quit();
      break;
    default:
      console.log("This is broken.");
    // process.exit();
  }
};
const viewDepartment = async () => {
  const result = await query("SELECT * FROM department");
  console.table(result);
  init();
};

const viewRoles = async () => {
  const roleResult = await query("SELECT * FROM role");
  console.table(roleResult);
  init();
};

const viewEmployees = async () => {
  const employeeResult = await query(`SELECT e.id, CONCAT(e.first_name, " ", e.last_name) AS name, r.title, CONCAT(e2.first_name, " ", e2.last_name) AS manager
  FROM employee AS e
  JOIN role AS r 
  ON e.role_id = r.id
  LEFT JOIN employee as e2
  ON e.manager_id = e2.id
  ORDER BY e.id;`);
  console.table(employeeResult);
  init(); 
};

const addDepartment = async () => {
  const addDepartmentQuestions = [
    {
      type: "input",
      message: "Type in the name of the new department.",
      name: "name",
    },
  ];
  const { name } = await inquirer.prompt(addDepartmentQuestions);
  await query("INSERT INTO department (name) VALUES(?)", [name]);
  viewDepartment();
};

const addRole = async () => {
  const departments = await query("SELECT id AS value, name FROM department");
  const addRoleQuestions = [
    {
      type: "input",
      message: "Input the role name.",
      name: "title",
    },
    {
      type: "input",
      message: "Input the salary amount.",
      name: "salary",
    },
    {
      type: "list",
      message: "Select the department this role is within.",
      name: "department_id",
      choices: departments,
    },
  ];
  const { title, salary, department_id } = await inquirer.prompt(
    addRoleQuestions
  );
  await query(
    "INSERT INTO role (title, salary, department_id) VALUES (?,?,?)",
    [title, parseInt(salary), department_id]
  );
  viewRoles();
};

addEmployee = async () => {
  const roles = await query("SELECT title AS name, id AS value FROM role");
  const managers = await query(
    "SELECT CONCAT(first_name, ' ', last_name) as name, id AS value FROM employee WHERE manager_id IS null"
  );
  managers.push({
    name: "No Manager",
    value: null,
  });
  console.log(roles);
  const addEmployeeQuestions = [
    {
      type: "input",
      message: "Input the employee's first name.",
      name: "first_name",
    },
    {
      type: "input",
      message: "Input the employee's last name.",
      name: "last_name",
    },
    {
      type: "list",
      message: "Select the title this employee holds.",
      name: "role_id",
      choices: roles,
    },
    {
      type: "list",
      message: "Select this employee's manager.",
      name: "manager_id",
      choices: managers,
    },
  ];
  const { first_name, last_name, role_id, manager_id } = await inquirer.prompt(
    addEmployeeQuestions
  );
  await query(
    "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)",
    [first_name, last_name, role_id, manager_id]
  );
  viewEmployees();
};

updateEmployee = async () => {
  const employeeUpdateOptions = await query(
    "SELECT CONCAT(first_name, ' ', last_name) as name, id AS value FROM employee"
  );
  const roles = await query("SELECT title AS name, id AS value FROM role");
  const managers = await query(
    "SELECT CONCAT(first_name, ' ', last_name) as name, id AS value FROM employee WHERE manager_id IS null"
  );
  managers.push({
    name: "No Manager",
    value: null,
  });
  const updateEmployeeQuestions = [
    {
      type: "list",
      message: "Select the employee you would like to work with.",
      name: "id",
      choices: employeeUpdateOptions,
    },
    {
      type: "list",
      message: "Select the role this employee now holds.",
      name: "role_id",
      choices: roles,
    },
    {
      type: "list",
      message: "Select the manager this employee will be under, if applicable.",
      name: "manager_id",
      choices: managers,
    },
  ];
  const { id, role_id, manager_id } = await inquirer.prompt(
    updateEmployeeQuestions
  );
  await query("UPDATE employee SET role_id =?, manager_id =? WHERE id=?", [
    role_id,
    manager_id,
    id,
  ]);
  viewEmployees();
};

const quit = () => {
  console.log("Goodbye.");
  process.exit();
};

init();
