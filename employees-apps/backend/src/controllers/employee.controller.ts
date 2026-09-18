import { Request, Response } from "express";
import {
  createEmployee,
  getActiveEmployees,
  updateEmployee,
  deleteEmployee,
} from "../services/employee.service";
import {
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
} from "../models/employee.model";

export const create = (
  req: Request<{}, {}, CreateEmployeeRequest>,
  res: Response,
): void => {
  const { fullName, designation, department, email } = req.body;

  if (!fullName || !designation || !department || !email) {
    res.status(400).json({
      success: false,
      message: "fullName, designation, department and email are required",
    });
    return;
  }

  const employee = createEmployee({
    fullName,
    designation,
    department,
    email,
  });

  res.status(201).json({
    success: true,
    message: "Employee created successfully",
    data: employee,
  });
};

export const getAll = (_req: Request, res: Response): void => {
  const employees = getActiveEmployees();

  res.status(200).json({
    success: true,
    data: employees,
  });
};

export const update = (
  req: Request<{ id: string }, {}, UpdateEmployeeRequest>,
  res: Response,
): void => {
  const employee = updateEmployee(req.params.id, req.body);

  if (!employee) {
    res.status(404).json({
      success: false,
      message: "Employee not found",
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Employee updated successfully",
    data: employee,
  });
};

export const remove = (req: Request<{ id: string }>, res: Response): void => {
  const employee = deleteEmployee(req.params.id);

  if (!employee) {
    res.status(404).json({
      success: false,
      message: "Employee not found",
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Employee moved to trash",
    data: employee,
  });
};
