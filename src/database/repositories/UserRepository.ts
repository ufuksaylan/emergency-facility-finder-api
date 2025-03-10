import type { DataSource, Repository } from "typeorm";
import { AppDataSource } from "../dataSource";
import { User } from "../entity/User";

export class UserRepository {
  private repository: Repository<User>;

  constructor(dataSource: DataSource = AppDataSource) {
    this.repository = dataSource.getRepository(User);
  }

  async findAllAsync(): Promise<User[]> {
    return this.repository.find();
  }

  async findByIdAsync(id: number): Promise<User | null> {
    return this.repository.findOneBy({ id });
  }

  async createAsync(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const newUser = this.repository.create(user);
    return this.repository.save(newUser);
  }

  async updateAsync(id: number, user: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>): Promise<User | null> {
    await this.repository.update(id, user);
    return this.findByIdAsync(id);
  }

  async deleteAsync(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== 0;
  }
}
