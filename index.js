const mysql = require("mysql2");
const inquirer = require("inquirer");
const util = require("util");


const db = mysql.createConnection(
  {
    host: "127.0.0.1",
    user: "root",
    password: "roo1234",
    database: "employees_db",
  }
);

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
      // "Update Employee",
      "Quit"
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
    case "Quit":
      quit();
      break;
    default:
      console.log("This is broken.")
      // process.exit();
  }
};
const viewDepartment = async () => {
const result = await query("SELECT * FROM department")
  console.table(result);
  init();
};

const viewRoles = async () => {
  const roleResult = await query ("SELECT * FROM role")
  console.table(roleResult);
  init();
};

//SHOULD THIS HAVE MANAGERS NAMES INSTEAD OF THE MANAGER's EMPLOYEE ID 
const viewEmployees = async () => {
  const employeeResult = await query ("SELECT * FROM employee")
  console.table(employeeResult);
  init();
};

//UPDATING AS A NUMBER RATHER THAN THE INPUTTED TEXT "0"
const addDepartment = async () => {
  // const newDepartment = await query("SELECT name AS value FROM department")
  const addDepartmentQuestions = [
    {
      type: "input",
      message: "Type in the name of the new department.",
      name: "name"
    }
  ]
  const answer = await inquirer.prompt(addDepartmentQuestions);
  await query("INSERT INTO department (name) VALUES (?)", answer);
  viewDepartment();
}

const addRole = async () => {
const departments = await query("SELECT id AS value, name FROM department") 
const addRoleQuestions = [
  {
    type: "input",
    message:"Input the role name.",
    name: "title"
  },
  {
    type: "input",
    message: "Input the salary amount.",
    name: "salary"
  },
  {
    type: "list",
    message: "Select the department this role is within.",
    name: "department_id",
    choices: departments
  }
]
const {title, salary, department_id} = await inquirer.prompt(addRoleQuestions);
await query ("INSERT INTO role (title, salary, department_id) VALUES (?,?,?)", [title, parseInt(salary), department_id])
viewRole();
};

addEmployee = async () => {
  const roles = await query("SELECT id AS value, title FROM role")
  const addEmployeeQuestions = [
    {
      type: "input",
      message: "Input the employee's first name.",
      name: "first_name"
    },
    {
      type: "input",
      message: "Input the employee's last name."
    }
  ]
}

const quit = () => {
console.log("Goodbye.")
  process.exit() 
}

init();
