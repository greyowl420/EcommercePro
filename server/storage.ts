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

  async initializeProducts() {
    const sampleProducts = [
      {
        name: "Medjool Dates",
        description: "Premium quality Medjool dates, known for their large size and sweet, caramel-like taste. Perfect for snacking or natural sweetening.",
        price: "175.00",
        imageUrl: "https://images.unsplash.com/photo-1587075417548-a55c3fb9e1c9",
        discountPercentage: 10,
        protein: "1.8",
        fat: "0.2",
        carbohydrates: "75.0"
      },
      {
        name: "Dried Figs",
        description: "Sweet and chewy dried figs, packed with fiber and minerals. A traditional Moroccan favorite.",
        price: "115.00",
        imageUrl: "https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1",
        discountPercentage: null,
        protein: "3.3",
        fat: "0.9",
        carbohydrates: "64.0"
      },
      {
        name: "Premium Saffron",
        description: "High-quality Moroccan saffron threads, perfect for adding authentic flavor and golden color to your dishes.",
        price: "25000.00",
        imageUrl: "https://images.unsplash.com/photo-1607604760190-ec9ccc12156e",
        discountPercentage: 5,
        protein: "0.0",
        fat: "0.0",
        carbohydrates: "0.0"
      },
      {
        name: "Cumin Spice",
        description: "Freshly ground cumin with intense aroma. Essential spice for Moroccan cuisine.",
        price: "300.00",
        imageUrl: "https://images.unsplash.com/photo-1599909631725-41b4948d9672",
        discountPercentage: null,
        protein: "0.0",
        fat: "0.0",
        carbohydrates: "0.0"
      },
      {
        name: "Green Olives",
        description: "Fresh and crisp Moroccan green olives, perfect for snacking or cooking.",
        price: "70.00",
        imageUrl: "https://images.unsplash.com/photo-1612257436393-06763bce9f0c",
        discountPercentage: null,
        protein: "0.8",
        fat: "15.0",
        carbohydrates: "3.8"
      },
      {
        name: "Dried Apricots",
        description: "Naturally sweet dried apricots, rich in fiber and vitamins. A healthy snack option.",
        price: "105.00",
        imageUrl: "https://images.unsplash.com/photo-1596404643764-2a2461483a3b",
        discountPercentage: null,
        protein: "3.4",
        fat: "0.5",
        carbohydrates: "62.6"
      },
      {
        name: "Ras el Hanout",
        description: "Traditional Moroccan spice blend combining over 20 different spices. Perfect for tagines and marinades.",
        price: "375.00",
        imageUrl: "https://images.unsplash.com/photo-1596547609652-9cf5d8c22b1f",
        discountPercentage: 15,
        protein: "0.0",
        fat: "0.0",
        carbohydrates: "0.0"
      },
      {
        name: "Picholine Marocaine Olives",
        description: "Premium Moroccan olives with a distinctive flavor and meaty texture.",
        price: "92.50",
        imageUrl: "https://images.unsplash.com/photo-1593001874117-c99c300f6c09",
        discountPercentage: null,
        protein: "0.8",
        fat: "15.0",
        carbohydrates: "3.8"
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