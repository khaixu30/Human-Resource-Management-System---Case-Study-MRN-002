// middlewares/ownershipCheck.js
// Runs AFTER authorize() — it's the more expensive check (may hit the DB),
// so it only runs once role-level access is already confirmed (B.5).
//
// Covers:
//  - self             -> req.params[paramKey] must equal req.user.employeeId
//                        (own profile / own payslip / own attendance)
//  - managerScope      -> req.user must be a direct/indirect manager of the
//                        target employee (team-scoped leave/attendance/dashboard)
//  - ownerOrPrivileged -> 'self' OR a privileged role (HRAdmin/SuperAdmin)
//
// Adjust the Employee model import path to match your project structure.

import AppError from './appError.middleware.js';
import Employee from '../models/employee.model.js';

const PRIVILEGED_ROLES = ['SuperAdmin', 'HRAdmin'];

function ownershipCheck({ strategy = 'self', paramKey = 'id', allowPrivileged = true } = {}) {
  return async function (req, res, next) {
    try {
      if (allowPrivileged && PRIVILEGED_ROLES.includes(req.user.role)) {
        return next();
      }

      const targetEmployeeId = req.params[paramKey];

      if (strategy === 'self' || strategy === 'ownerOrPrivileged') {
        if (String(req.user.employeeId) === String(targetEmployeeId)) {
          return next();
        }
        return next(new AppError(403, 'FORBIDDEN', 'You do not have access to this resource'));
      }

      if (strategy === 'managerScope') {
        if (req.user.role !== 'Manager') {
          return next(new AppError(403, 'FORBIDDEN', 'You do not have access to this resource'));
        }

        const inScope = await isInManagerChain(targetEmployeeId, req.user.employeeId);

        if (!inScope) {
          return next(new AppError(403, 'FORBIDDEN', 'Employee is outside your reporting scope'));
        }

        return next();
      }

      return next(new AppError(500, 'INTERNAL_ERROR', `Unknown ownership strategy: ${strategy}`));
    } catch (err) {
      return next(err);
    }
  };
}

// Walks the managerId chain upward from the target employee, looking for managerId.
async function isInManagerChain(targetEmployeeId, managerId, maxDepth = 10) {
  let currentId = targetEmployeeId;

  for (let depth = 0; depth < maxDepth; depth += 1) {
    const employee = await Employee.findById(currentId).select('managerId').lean();
    if (!employee || !employee.managerId) return false;
    if (String(employee.managerId) === String(managerId)) return true;
    currentId = employee.managerId;
  }

  return false;
}

export default ownershipCheck;