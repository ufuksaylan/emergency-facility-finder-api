import { ServiceResponse } from "@/common/models/serviceResponse";
import type { User } from "@/database/entity/User";
import { UserRepository } from "@/database/repositories/UserRepository";
import { logger } from "@/server";
// src/api/user/userService.ts
import { StatusCodes } from "http-status-codes";
import type { UserDTO } from "./userModel";

export class UserService {
  private userRepository: UserRepository;

  constructor(repository: UserRepository = new UserRepository()) {
    this.userRepository = repository;
  }

  // Map database entity to DTO if needed
  private mapToDTO(user: User): UserDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      age: user.age,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  // Retrieves all users from the database
  async findAll(): Promise<ServiceResponse<UserDTO[] | null>> {
    try {
      const users = await this.userRepository.findAllAsync();
      if (!users || users.length === 0) {
        return ServiceResponse.failure("No Users found", null, StatusCodes.NOT_FOUND);
      }

      const userDTOs = users.map((user) => this.mapToDTO(user));
      return ServiceResponse.success<UserDTO[]>("Users found", userDTOs);
    } catch (ex) {
      const errorMessage = `Error finding all users: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving users.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Retrieves a single user by their ID
  async findById(id: number): Promise<ServiceResponse<UserDTO | null>> {
    try {
      const user = await this.userRepository.findByIdAsync(id);
      if (!user) {
        return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
      }

      const userDTO = this.mapToDTO(user);
      return ServiceResponse.success<UserDTO>("User found", userDTO);
    } catch (ex) {
      const errorMessage = `Error finding user with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while finding user.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  // Creates a new user
  async create(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<ServiceResponse<UserDTO | null>> {
    try {
      const newUser = await this.userRepository.createAsync(userData);
      const userDTO = this.mapToDTO(newUser);
      return ServiceResponse.success<UserDTO>("User created successfully", userDTO, StatusCodes.CREATED);
    } catch (ex) {
      const errorMessage = `Error creating user: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while creating user.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  // Updates an existing user
  async update(
    id: number,
    userData: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>,
  ): Promise<ServiceResponse<UserDTO | null>> {
    try {
      const user = await this.userRepository.updateAsync(id, userData);
      if (!user) {
        return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
      }

      const userDTO = this.mapToDTO(user);
      return ServiceResponse.success<UserDTO>("User updated successfully", userDTO);
    } catch (ex) {
      const errorMessage = `Error updating user with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while updating user.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  // Deletes a user
  async delete(id: number): Promise<ServiceResponse<null>> {
    try {
      const deleted = await this.userRepository.deleteAsync(id);
      if (!deleted) {
        return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
      }

      return ServiceResponse.success<null>("User deleted successfully", null);
    } catch (ex) {
      const errorMessage = `Error deleting user with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while deleting user.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const userService = new UserService();
