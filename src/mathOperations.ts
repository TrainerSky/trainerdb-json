import { deepGet, deepSet } from "./utils";

export async function modifyNumber(load: Function, save: Function, key: string, fn: (n: number) => number) {
  const data = await load();
  const value = deepGet(data, key) || 0;
  if (typeof value !== "number") throw new Error(`"${key}" is not a number`);
  deepSet(data, key, fn(value));
  await save(data);
}

export async function plus(load: Function, save: Function, key: string, amount: number) {
  return modifyNumber(load, save, key, (n) => n + amount);
}

export async function minus(load: Function, save: Function, key: string, amount: number) {
  return plus(load, save, key, -amount);
}

export async function multiply(load: Function, save: Function, key: string, factor: number) {
  return modifyNumber(load, save, key, (n) => n * factor);
}

export async function divide(load: Function, save: Function, key: string, divisor: number) {
  if (divisor === 0) throw new Error("Cannot divide by zero");
  return multiply(load, save, key, 1 / divisor);
}
