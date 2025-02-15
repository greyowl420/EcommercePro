import { users, products } from "@shared/schema";
import type { User, Product, InsertUser, InsertProduct } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser & { isAdmin?: boolean }): Promise<User>;
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<void>;
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  readonly sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser & { isAdmin?: boolean }): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        isAdmin: insertUser.isAdmin ?? false,
      })
      .returning();
    return user;
  }

  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db
      .insert(products)
      .values(product)
      .returning();
    return newProduct;
  }

  async updateProduct(
    id: number,
    update: Partial<InsertProduct>
  ): Promise<Product | undefined> {
    const [updated] = await db
      .update(products)
      .set(update)
      .where(eq(products.id, id))
      .returning();
    return updated;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Add initial products
  async initializeProducts() {
    const sampleProducts = [
      {
        name: "Organic Protein Bar",
        description: "A delicious and nutritious snack made with natural ingredients. Perfect for pre or post workout.",
        price: "3.99",
        imageUrl: "https://images.unsplash.com/photo-1622467827417-bbe2237067a9",
        discountPercentage: 10,
        protein: "12.5",
        fat: "7.2",
        carbohydrates: "22.4"
      },
      {
        name: "Almond Butter Smoothie",
        description: "Creamy smoothie blend with almond butter, banana, and oat milk. Rich in protein and healthy fats.",
        price: "6.99",
        imageUrl: "https://images.unsplash.com/photo-1577805947697-89e18249d767",
        discountPercentage: null,
        protein: "15.0",
        fat: "8.5",
        carbohydrates: "25.0"
      },
      {
        name: "Quinoa Bowl",
        description: "Fresh and filling quinoa bowl with roasted vegetables and tahini dressing. High in protein and fiber.",
        price: "12.99",
        imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
        discountPercentage: 15,
        protein: "18.2",
        fat: "12.4",
        carbohydrates: "45.6"
      }
    ];

    for (const product of sampleProducts) {
      const existing = await db
        .select()
        .from(products)
        .where(eq(products.name, product.name));

      if (existing.length === 0) {
        await this.createProduct(product);
      }
    }
  }
}

export const storage = new DatabaseStorage();
// Initialize products
storage.initializeProducts().catch(console.error);