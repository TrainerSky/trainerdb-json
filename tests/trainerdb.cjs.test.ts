import TrainerDB from "../src/trainerdb"; // Ensure it points to your built CJS file
import fs from "fs-extra";

const TEST_FILE = "test-db-cjs.json";
const db = new TrainerDB("./db", TEST_FILE);

describe("TrainerDB - CommonJS Tests", () => {
  beforeEach(async () => {
    await db.clear();
  });

  afterAll(async () => {
    await db.delete();
  });

  test("set & get", async () => {
    await db.set("user.name", "Alice");
    expect(await db.get("user.name")).toBe("Alice");
  });

  test("has", async () => {
    await db.set("user.age", 30);
    expect(await db.has("user.age")).toBe(true);
    expect(await db.has("user.gender")).toBe(false);
  });

  test("update", async () => {
    await db.set("user.city", "New York");
    await db.update("user.city", "Los Angeles");
    expect(await db.get("user.city")).toBe("Los Angeles");
  });

  test("merge", async () => {
    await db.set("settings", { theme: "dark" });
    await db.merge("settings", { lang: "en" });
    expect(await db.get("settings")).toEqual({ theme: "dark", lang: "en" });
  });

  test("remove", async () => {
    await db.set("settings.theme", "dark");
    await db.remove("settings.theme");
    expect(await db.get("settings.theme")).toBeNull();
  });

  test("delete", async () => {
    await db.set("testKey", "value");
    await db.delete();
    expect(fs.existsSync(`./db/${TEST_FILE}`)).toBe(false);
  });

  test("clear", async () => {
    await db.set("user", { name: "Alice", age: 25 });

    console.log("Before clear:", await db.get("user")); // Debugging step

    await db.clear("user");

    console.log("After clear:", await db.get("user")); // Should be null

    expect(await db.get("user")).toBeNull();
  });

  test("math operations", async () => {
    await db.set("wallet.balance", 60);
    await db.plus("wallet.balance", 40);
    await db.minus("wallet.balance", 20);
    await db.multiply("wallet.balance", 1.5);
    await db.divide("wallet.balance", 4);
    expect(await db.get("wallet.balance")).toBe(30);
  });

  test("keys & values", async () => {
    await db.set("config", { mode: "dark", lang: "en" });
    expect(await db.keys("config")).toEqual(["mode", "lang"]);
    expect(await db.values("config")).toEqual(["dark", "en"]);
  });

  test("find & filter", async () => {
    await db.set("users", [
      { name: "Alice", role: "admin" },
      { name: "Bob", role: "user" },
    ]);

    expect(await db.find("users", (u: { name: string; role: string }) => u.name === "Bob"))
      .toEqual({ name: "Bob", role: "user" });

    expect(await db.filter("users", (u: { name: string; role: string }) => u.role === "admin"))
      .toEqual([{ name: "Alice", role: "admin" }]);
  });

  test("sort & uniq", async () => {
    await db.set("numbers", [5, 3, 8, 1]);

    await db.sort("numbers", (a: number, b: number) => a - b);

    expect(await db.get("numbers")).toEqual([1, 3, 5, 8]);

    await db.set("tags", ["red", "blue", "red", "green"]);
    await db.uniq("tags");
    expect(await db.get("tags")).toEqual(["red", "blue", "green"]);
  });

  test("groupBy & countBy", async () => {
    await db.set("users", [
      { name: "Alice", role: "admin" },
      { name: "Bob", role: "user" },
      { name: "Charlie", role: "admin" },
    ]);
    expect(await db.groupBy("users", "role")).toEqual({
      admin: [{ name: "Alice", role: "admin" }, { name: "Charlie", role: "admin" }],
      user: [{ name: "Bob", role: "user" }]
    });
    expect(await db.countBy("users", "role")).toEqual({ admin: 2, user: 1 });
  });

  test("shuffle", async () => {
    await db.set("tags", ["red", "blue", "green", "yellow"]);
    const shuffled = await db.shuffle("tags");
    expect(shuffled).toEqual(expect.arrayContaining(["red", "blue", "green", "yellow"]));
  });
});
