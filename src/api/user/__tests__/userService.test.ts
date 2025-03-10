import { UserService } from "@/api/user/userService";
import type { UserRepository } from "@/database/repositories/UserRepository";
// src/api/user/__tests__/userService.test.ts
import { StatusCodes } from "http-status-codes";

// Mock the UserRepository
vi.mock("@/database/repositories/UserRepository");

describe("UserService", () => {
  // Sample test data
  const mockUsers = [
    {
      id: 1,
      name: "Alice",
      email: "alice@example.com",
      age: 42,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: "Robert",
      email: "robert@example.com",
      age: 21,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // Create mock repository and service for testing
  let mockUserRepo: UserRepository;
  let userService: UserService;

  beforeEach(() => {
    // Reset all mocks
    vi.resetAllMocks();

    // Create a new mock repository instance
    mockUserRepo = {
      findAllAsync: vi.fn(),
      findByIdAsync: vi.fn(),
      createAsync: vi.fn(),
      updateAsync: vi.fn(),
      deleteAsync: vi.fn(),
    } as unknown as UserRepository;

    // Create a new service instance with the mock repository
    userService = new UserService(mockUserRepo);
  });

  describe("findAll", () => {
    it("should return all users when users exist", async () => {
      // Arrange
      vi.mocked(mockUserRepo.findAllAsync).mockResolvedValue(mockUsers);

      // Act
      const result = await userService.findAll();

      // Assert
      expect(result.success).toBeTruthy();
      expect(result.responseObject).toHaveLength(mockUsers.length);
      expect(result.message).toContain("Users found");
      expect(result.statusCode).toEqual(StatusCodes.OK);
      expect(mockUserRepo.findAllAsync).toHaveBeenCalledTimes(1);
    });

    it("should return failure when no users exist", async () => {
      // Arrange
      vi.mocked(mockUserRepo.findAllAsync).mockResolvedValue([]);

      // Act
      const result = await userService.findAll();

      // Assert
      expect(result.success).toBeFalsy();
      expect(result.responseObject).toBeNull();
      expect(result.message).toContain("No Users found");
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
    });

    it("should handle errors properly", async () => {
      // Arrange
      const errorMessage = "Database error";
      vi.mocked(mockUserRepo.findAllAsync).mockRejectedValue(new Error(errorMessage));

      // Act
      const result = await userService.findAll();

      // Assert
      expect(result.success).toBeFalsy();
      expect(result.responseObject).toBeNull();
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });

  describe("findById", () => {
    it("should return a user when valid ID is provided", async () => {
      // Arrange
      const testId = 1;
      const expectedUser = mockUsers.find((user) => user.id === testId);
      vi.mocked(mockUserRepo.findByIdAsync).mockResolvedValue(expectedUser);

      // Act
      const result = await userService.findById(testId);

      // Assert
      expect(result.success).toBeTruthy();
      expect(result.responseObject).toEqual(expectedUser);
      expect(result.message).toContain("User found");
      expect(mockUserRepo.findByIdAsync).toHaveBeenCalledWith(testId);
    });

    it("should return failure for non-existent ID", async () => {
      // Arrange
      const testId = 999;
      vi.mocked(mockUserRepo.findByIdAsync).mockResolvedValue(null);

      // Act
      const result = await userService.findById(testId);

      // Assert
      expect(result.success).toBeFalsy();
      expect(result.responseObject).toBeNull();
      expect(result.message).toContain("User not found");
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
    });
  });

  describe("create", () => {
    it("should create and return a new user", async () => {
      // Arrange
      const newUserData = {
        name: "New User",
        email: "newuser@example.com",
        age: 30,
      };

      const createdUser = {
        id: 3,
        ...newUserData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(mockUserRepo.createAsync).mockResolvedValue(createdUser);

      // Act
      const result = await userService.create(newUserData);

      // Assert
      expect(result.success).toBeTruthy();
      expect(result.responseObject).toEqual(createdUser);
      expect(result.statusCode).toEqual(StatusCodes.CREATED);
      expect(mockUserRepo.createAsync).toHaveBeenCalledWith(newUserData);
    });

    it("should handle creation errors", async () => {
      // Arrange
      const newUserData = {
        name: "New User",
        email: "newuser@example.com",
        age: 30,
      };

      vi.mocked(mockUserRepo.createAsync).mockRejectedValue(new Error("Creation failed"));

      // Act
      const result = await userService.create(newUserData);

      // Assert
      expect(result.success).toBeFalsy();
      expect(result.responseObject).toBeNull();
      expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });

  describe("update", () => {
    it("should update and return the user", async () => {
      // Arrange
      const userId = 1;
      const updateData = {
        name: "Updated Name",
        age: 45,
      };

      const updatedUser = {
        id: userId,
        name: "Updated Name",
        email: "alice@example.com",
        age: 45,
        createdAt: mockUsers[0].createdAt,
        updatedAt: new Date(),
      };

      vi.mocked(mockUserRepo.updateAsync).mockResolvedValue(updatedUser);

      // Act
      const result = await userService.update(userId, updateData);

      // Assert
      expect(result.success).toBeTruthy();
      expect(result.responseObject).toEqual(updatedUser);
      expect(result.message).toContain("User updated");
      expect(mockUserRepo.updateAsync).toHaveBeenCalledWith(userId, updateData);
    });

    it("should return failure when user doesn't exist", async () => {
      // Arrange
      const userId = 999;
      const updateData = { name: "Won't Update" };

      vi.mocked(mockUserRepo.updateAsync).mockResolvedValue(null);

      // Act
      const result = await userService.update(userId, updateData);

      // Assert
      expect(result.success).toBeFalsy();
      expect(result.responseObject).toBeNull();
      expect(result.message).toContain("User not found");
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
    });
  });

  describe("delete", () => {
    it("should delete the user successfully", async () => {
      // Arrange
      const userId = 1;
      vi.mocked(mockUserRepo.deleteAsync).mockResolvedValue(true);

      // Act
      const result = await userService.delete(userId);

      // Assert
      expect(result.success).toBeTruthy();
      expect(result.responseObject).toBeNull();
      expect(result.message).toContain("User deleted");
      expect(mockUserRepo.deleteAsync).toHaveBeenCalledWith(userId);
    });

    it("should return failure when user doesn't exist", async () => {
      // Arrange
      const userId = 999;
      vi.mocked(mockUserRepo.deleteAsync).mockResolvedValue(false);

      // Act
      const result = await userService.delete(userId);

      // Assert
      expect(result.success).toBeFalsy();
      expect(result.responseObject).toBeNull();
      expect(result.message).toContain("User not found");
      expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
    });
  });
});
