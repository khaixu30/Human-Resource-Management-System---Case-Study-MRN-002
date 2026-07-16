import Employee from "../models/employee.model.js";

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; 

function randomSuffix(length = 4) {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return result;
}

export async function generateEmployeeId() {
  const year = new Date().getFullYear();
  let employeeId;
  let exists = true;

  while (exists) {
    const suffix = randomSuffix(4);
    employeeId = `EMP-${year}-${suffix}`;

    const existing = await Employee.findOne({ employeeId });
    exists = !!existing;
  }

  return employeeId;
}