import { CreateUserSchema, GetUserSchema, UpdateUserSchema } from "@/api/user/userModel";
import { userService } from "@/api/user/userService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import type { Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";

class UserController {
  // Get all users
  public getUsers: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await userService.findAll();
    return handleServiceResponse(serviceResponse, res);
  };

  // Get a single user by ID
  public getUser: RequestHandler = async (req: Request, res: Response) => {
    try {
      // Validate the request params
      const { params } = GetUserSchema.parse({ params: req.params });
      const id = Number(params.id);

      const serviceResponse = await userService.findById(id);
      return handleServiceResponse(serviceResponse, res);
    } catch (error) {
      // Handle validation errors
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid user ID format",
        data: null,
      });
    }
  };

  // Create a new user
  public createUser: RequestHandler = async (req: Request, res: Response) => {
    try {
      // Validate the request body
      const { body } = CreateUserSchema.parse({ body: req.body });

      const serviceResponse = await userService.create(body);
      return handleServiceResponse(serviceResponse, res);
    } catch (error) {
      // Handle validation errors
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid user data",
        data: null,
      });
    }
  };

  // Update an existing user
  public updateUser: RequestHandler = async (req: Request, res: Response) => {
    try {
      // Validate the request params and body
      const { params, body } = UpdateUserSchema.parse({
        params: req.params,
        body: req.body,
      });

      const id = Number(params.id);
      const serviceResponse = await userService.update(id, body);
      return handleServiceResponse(serviceResponse, res);
    } catch (error) {
      // Handle validation errors
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid request data",
        data: null,
      });
    }
  };

  // Delete a user
  public deleteUser: RequestHandler = async (req: Request, res: Response) => {
    try {
      // Validate the request params
      const { params } = GetUserSchema.parse({ params: req.params });
      const id = Number(params.id);

      const serviceResponse = await userService.delete(id);
      return handleServiceResponse(serviceResponse, res);
    } catch (error) {
      // Handle validation errors
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid user ID format",
        data: null,
      });
    }
  };
}

export const userController = new UserController();
