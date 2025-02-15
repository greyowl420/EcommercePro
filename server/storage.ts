import { users, products } from "@shared/schema";
import type { User, Product, InsertUser, InsertProduct } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<void>;
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private currentUserId: number;
  private currentProductId: number;
  readonly sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.currentUserId = 1;
    this.currentProductId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });

    // Seed initial admin user
    this.createUser({
      username: "admin",
      password: "admin",
      isAdmin: true,
    });

    // Seed some initial products
    const sampleProducts = [
      {
        name: "Premium Watch",
        description: "Elegant timepiece for any occasion",
        price: "299.99",
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
        discountPercentage: 15
      },
      {
        name: "Wireless Headphones",
        description: "Premium sound quality with noise cancellation",
        price: "199.99",
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
        discountPercentage: null
      }
    ];

    sampleProducts.forEach(product => this.createProduct(product));
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser & { isAdmin?: boolean }): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { id, ...insertUser, isAdmin: insertUser.isAdmin ?? false };
    this.users.set(id, user);
    return user;
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const newProduct = { id, ...product };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(
    id: number,
    update: Partial<InsertProduct>
  ): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...update };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: number): Promise<void> {
    this.products.delete(id);
  }
}

export const storage = new MemStorage();
