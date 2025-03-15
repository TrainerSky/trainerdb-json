export const deepGet = (obj: any, path: string): any => {
  return path.split(".").reduce((o, key) => {
    if (o && typeof o === "object") {
      return o[key];
    }
    return undefined;
  }, obj);
};

export const deepSet = (obj: any, path: string, value: any): void => {
  const keys = path.split(".");
  keys.reduce((o, key, i) => {
    if (o && typeof o === "object") {
      if (i === keys.length - 1) {
        o[key] = value;
      } else {
        o[key] = o[key] || {}; // Ensure intermediate objects exist
      }
    }
    return o[key];
  }, obj);
};

export const deepHas = (obj: any, path: string): boolean => {
  return deepGet(obj, path) !== undefined;
};

export const deepRemove = (obj: any, path: string): void => {
  const keys = path.split(".");
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    if (!(keys[i] in current)) return; // Stop if path is invalid
    current = current[keys[i]];
  }

  delete current[keys[keys.length - 1]];
};
