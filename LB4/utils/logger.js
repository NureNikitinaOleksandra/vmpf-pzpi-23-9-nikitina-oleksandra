import { Log } from "../models/index.js";

export const systemLog = async (action, userId, details) => {
  try {
    await Log.create({ action, userId, details });
  } catch (error) {
    console.error("Помилка запису логу:", error);
  }
};
