import { deepGet, deepSet } from "./utils";

async function modifyNumber(load: Function, save: Function, key: string, fn: (n: number) => number) {
  const data = await load();
  const value = typeof deepGet(data, key) === "number" ? deepGet(data, key) : 0;
  deepSet(data, key, fn(value));
  await save(data);
}

export const plus = (load: Function, save: Function, key: string, amount: number) =>
  modifyNumber(load, save, key, (n) => n + amount);

export const minus = (load: Function, save: Function, key: string, amount: number) =>
  plus(load, save, key, -amount);

export const multiply = (load: Function, save: Function, key: string, factor: number) =>
  modifyNumber(load, save, key, (n) => n * factor);

export const divide = (load: Function, save: Function, key: string, divisor: number) => {
  if (divisor === 0) throw new Error("Cannot divide by zero");
  return multiply(load, save, key, 1 / divisor);
};
