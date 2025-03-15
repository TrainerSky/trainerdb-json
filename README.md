# TrainerDB-Json - Lightweight And Powerful JSON Database for Node.js

TrainerDB-Json is a lightweight and poweful file-based JSON database that supports both **CommonJS (require)**.

-  **Zero Dependencies** (only `fs-extra`)
-  **Fast & Simple** Key-Value Storage
-  **Supports CommonJS**
-  **Built-in Methods**: CRUD, Array Ops, Math, Sorting, Filtering, Grouping

---

## ** Installation**
```sh
npm install trainerdb-json
```

---

## ** Usage**

### ** Importing the Module**
```js
const TrainerDB = require("trainerdb-json");
const db = new TrainerDB("./db", "database.json");
```

## ** Basic CRUD Operations**
### **Set & Get Data**
```js
await db.set("user.name", "Alice");
console.log(await db.get("user.name")); // "Alice"
```

### **Check If Key Exists**
```js
console.log(await db.has("user.name")); // true
console.log(await db.has("user.age")); // false
```

### **Update Data**
```js
await db.update("user.name", "Bob");
console.log(await db.get("user.name")); // "Bob"
```

### **Merge Objects**
```js
await db.set("settings", { theme: "dark" });
await db.merge("settings", { lang: "en" });
console.log(await db.get("settings")); // { theme: "dark", lang: "en" }
```

### **Remove Key**
```js
await db.remove("user.name");
console.log(await db.get("user.name")); // undefined
```

### **Delete Entire Database**
```js
await db.delete();
```

---

## ** Math Operations**
```js
await db.set("wallet.balance", 100);
await db.plus("wallet.balance", 50);  // 100 + 50 = 150
await db.minus("wallet.balance", 20); // 150 - 20 = 130
await db.multiply("wallet.balance", 2); // 130 * 2 = 260
await db.divide("wallet.balance", 4); // 260 / 4 = 65
console.log(await db.get("wallet.balance")); // 65
```

---

## ** Array Operations**
### **Sorting**
```js
await db.set("numbers", [5, 3, 8, 1]);
await db.sort("numbers", (a, b) => a - b);
console.log(await db.get("numbers")); // [1, 3, 5, 8]
```

### ** Remove Duplicates**
```js
await db.set("tags", ["red", "blue", "red", "green"]);
await db.uniq("tags");
console.log(await db.get("tags")); // ["red", "blue", "green"]
```

### ** Shuffle Array**
```js
await db.set("tags", ["red", "blue", "green", "yellow"]);
await db.shuffle("tags");
console.log(await db.get("tags")); // Randomized order
```

---

## ** Find & Filter**
### **Find First Match**
```js
await db.set("users", [
  { name: "Alice", role: "admin" },
  { name: "Bob", role: "user" },
]);
const user = await db.find("users", (u) => u.name === "Bob");
console.log(user); // { name: "Bob", role: "user" }
```

### **Filter**
```js
const admins = await db.filter("users", (u) => u.role === "admin");
console.log(admins); // [{ name: "Alice", role: "admin" }]
```

---

## ** Group & Count**
### **Group by Property**
```js
await db.set("users", [
  { name: "Alice", role: "admin" },
  { name: "Bob", role: "user" },
  { name: "Charlie", role: "admin" },
]);
console.log(await db.groupBy("users", "role"));
// {
//   admin: [{ name: "Alice", role: "admin" }, { name: "Charlie", role: "admin" }],
//   user: [{ name: "Bob", role: "user" }]
// }
```

### ** Count by Property**
```js
console.log(await db.countBy("users", "role"));
// { admin: 2, user: 1 }
```

---

## ** Keys & Values**
### **Get Object Keys**
```js
await db.set("config", { mode: "dark", lang: "en" });
console.log(await db.keys("config")); // ["mode", "lang"]
```

### ** Get Object Values**
```js
console.log(await db.values("config")); // ["dark", "en"]
```

---

## ** Clearing & Resetting**
### **Clear a Specific Key**
```js
await db.clear("users");
console.log(await db.get("users")); // undefined
```

### ** Clear Entire Database**
```js
await db.clear();
console.log(await db.get("config")); // undefined
```

---

## ** Contribution Guidelines**

We welcome contributions from the community! To contribute:

1. **Fork the repository** on GitHub.
2. **Clone your fork** to your local machine.
   ```sh
   git clone https://github.com/TrainerSky/trainerdb-json.git
   ```
3. **Create a new branch** for your feature or bug fix.
   ```sh
   git checkout -b my-feature
   ```
4. **Make your changes** and commit them.
   ```sh
   git commit -m "Added a new feature"
   ```
5. **Push to your fork** and submit a **pull request**.
   ```sh
   git push origin my-feature
   ```

We will review your changes and merge them if they align with the project's goals.

---

## ** License**
This project is licensed under the **MIT License**.

---

** Enjoy using TrainerDB-Json for your lightweight JSON-based database needs!**  
Let us know if you have any feedback or feature requests.
