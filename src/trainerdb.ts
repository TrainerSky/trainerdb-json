import fs from "fs-extra";
import path from "path";
import { deepGet, deepSet, deepHas, deepRemove } from "./utils";
import { plus, minus, multiply, divide } from "./mathOperations";

class TrainerDB {
  private dbDir: string;
  private filePath: string;

  constructor(dbDir: string, fileName: string) {
    this.dbDir = dbDir;
    this.filePath = path.join(this.dbDir, fileName);
    fs.ensureDirSync(this.dbDir);
    if (!fs.existsSync(this.filePath)) this.save({});
  }

  // Load Database
  private async load(): Promise<any> {
    return fs.readJSON(this.filePath).catch(() => ({}));
  }

  // Save Database
  private async save(data: any): Promise<void> {
    await fs.writeJSON(this.filePath, data, { spaces: 2 });
  }

  // Set Data
  async set(key: string, value: any): Promise<void> {
    const data = await this.load();
    deepSet(data, key, value);
    await this.save(data);
  }

  // Get Data
  async get(key: string): Promise<any> {
  const data = await this.load();
  return deepGet(data, key) ?? null;
  }

  // Check if Key Exists
  async has(key: string): Promise<boolean> {
    const data = await this.load();
    return deepHas(data, key);
  }

  // Update Data
  async update(key: string, value: any): Promise<void> {
    const data = await this.load();
    if (!deepHas(data, key)) throw new Error(`Key "${key}" does not exist`);
    deepSet(data, key, value);
    await this.save(data);
  }

  // Merge Object
  async merge(key: string, value: object): Promise<void> {
    const data = await this.load();
    const existing = deepGet(data, key) || {};
    if (typeof existing !== "object" || typeof value !== "object") {
      throw new Error(`"${key}" is not an object`);
    }
    deepSet(data, key, { ...existing, ...value });
    await this.save(data);
  }
  
  // Remove Key
  async remove(key: string): Promise<void> {
  const data = await this.load();
  deepRemove(data, key); // Ensure deep removal
  await this.save(data);
  }

  // Delete Entire Database
  async delete(): Promise<void> {
    await fs.remove(this.filePath);
  }

  async clear(key?: string): Promise<void> {
  const data = await this.load();

  if (key) {
    deepRemove(data, key); // Ensures deep removal of nested keys
  } else {
    Object.keys(data).forEach(k => delete data[k]); // Clears entire database
  }

  await this.save(data);
  }

  // Math Operations - Now Separated
  async plus(key: string, amount: number) {
    return plus(this.load, this.save, key, amount);
  }
  async minus(key: string, amount: number) {
    return minus(this.load, this.save, key, amount);
  }
  async multiply(key: string, factor: number) {
    return multiply(this.load, this.save, key, factor);
  }
  async divide(key: string, divisor: number) {
    return divide(this.load, this.save, key, divisor);
  }
  
  // Keys & Values
  async values(key: string): Promise<any[]> {
    const data = await this.load();
    const obj = deepGet(data, key) || {};
    if (typeof obj !== "object" || obj === null) throw new Error(`"${key}" is not an object`);
    
    return Object.values(obj);
  }

  async keys(key: string): Promise<string[]> {
  const data = await this.load();
  const obj = deepGet(data, key) || {}; // Use deepGet for nested keys
  if (typeof obj !== "object" || obj === null) {
    throw new Error(`"${key}" is not an object`);
  }
  return Object.keys(obj);
  }
  
  // Array Operations
  async sort(key: string, compareFn?: (a: any, b: any) => number): Promise<void> {
    const data = await this.load();
    const array = deepGet(data, key) || [];
    if (!Array.isArray(array)) throw new Error(`"${key}" is not an array`);
    
    array.sort(compareFn);
    deepSet(data, key, array);
    
    await this.save(data);
  }

  async uniq(key: string): Promise<void> {
    const data = await this.load();
    const array = deepGet(data, key) || [];
    if (!Array.isArray(array)) throw new Error(`"${key}" is not an array`);
    
    deepSet(data, key, [...new Set(array)]);
    
    await this.save(data);
  }

  async shuffle(key: string): Promise<any[]> {
    const data = await this.load();
    const array = deepGet(data, key) || [];
    if (!Array.isArray(array)) throw new Error(`"${key}" is not an array`);

    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    deepSet(data, key, array);
    await this.save(data);
    
    return array;
  }
  
  // Find first matching element in an array
  async find<T>(key: string, callback: (item: T) => boolean): Promise<T | undefined> {
    const data = await this.load();
    const array = deepGet(data, key) || [];
    if (!Array.isArray(array)) throw new Error(`"${key}" is not an array`);

    return array.find(callback);
  }

  // Supports deep filtering in arrays
  async filter<T>(key: string, callback: (item: T) => boolean): Promise<T[]> {
    const data = await this.load();
    const array = deepGet(data, key) || [];
    if (!Array.isArray(array)) throw new Error(`"${key}" is not an array`);

    return array.filter(callback);
  }

  // Grouping & Counting
  async groupBy(key: string, prop: string): Promise<object> {
    const data = await this.load();
    const array = deepGet(data, key) || [];
    if (!Array.isArray(array)) throw new Error(`"${key}" is not an array`);

    return array.reduce((acc, obj) => {
      const group = obj[prop];
      acc[group] = acc[group] || [];
      acc[group].push(obj);
      return acc;
    }, {});
  }

  async countBy(key: string, prop: string): Promise<object> {
    const data = await this.load();
    const array = deepGet(data, key) || [];
    if (!Array.isArray(array)) throw new Error(`"${key}" is not an array`);

    return array.reduce((acc, obj) => {
      const group = obj[prop];
      acc[group] = (acc[group] || 0) + 1;
      return acc;
    }, {});
  }
}

export default TrainerDB;
