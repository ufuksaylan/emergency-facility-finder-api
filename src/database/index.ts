import { AppDataSource } from "./dataSource";
import "reflect-metadata";

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database connection established successfully");
    return AppDataSource;
  } catch (error) {
    console.error("Error initializing database connection:", error);
    throw error;
  }
};

export { AppDataSource };

// Re-export everything from entity folder
export * from "./entity";

// Re-export everything from repositories folder
export * from "./repositories";
