const mysql = require("mysql");
const inquirer = require("inquirer");

let initialUserAction;

const initialQuestion = {
  type: "list",
  message: "Please choose one.",
  name: initialUserAction,
  choices: [
    "View Departments",
    "View Roles",
    "View Employees",
    "Add Department",
    "Add Role",
    "Add Employee",
    "Update Employee",
  ],
};

switch (tableDisplay) {
  case initialUserAction === "View Department":
    //display department from business_db;
    break;
  case initialUserAction === "View Roles":
    // display role table from business_db;
    break;
  case initialUserAction === "View Employees":
    // display employee table from business_db;
    break;
  default:
    return questions;
}


const addToTableFunction = () => {
  if (initialUserAction === "Add Department") {
    inquirer.prompt(
      {
        type: "input",
        message: "Please input the name of the department.",
        name: "newDepartmentAdd"
      }
    );
  } else if
}
