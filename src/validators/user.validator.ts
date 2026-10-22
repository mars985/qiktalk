// Keep in sync with qiktalk-backend/src/validators/user.validator.js

import { z } from "zod";
import { minLengthMessage, maxLengthMessage } from "./messages";
import {
  MIN_USERNAME_LENGTH,
  MAX_USERNAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH,
} from "@/constants/user.constants";

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(MIN_USERNAME_LENGTH, minLengthMessage("Username", MIN_USERNAME_LENGTH))
    .max(
      MAX_USERNAME_LENGTH,
      maxLengthMessage("Username", MAX_USERNAME_LENGTH),
    ),

  email: z.email("Invalid email address").trim().toLowerCase(),

  password: z
    .string()
    .min(MIN_PASSWORD_LENGTH, minLengthMessage("Password", MIN_PASSWORD_LENGTH))
    .max(
      MAX_PASSWORD_LENGTH,
      maxLengthMessage("Password", MAX_PASSWORD_LENGTH),
    ),
});

export const loginSchema = z.object({
  email: z.email("Invalid email address").trim().toLowerCase(),

  password: z
    .string()
    .min(MIN_PASSWORD_LENGTH, minLengthMessage("Password", MIN_PASSWORD_LENGTH))
    .max(
      MAX_PASSWORD_LENGTH,
      maxLengthMessage("Password", MAX_PASSWORD_LENGTH),
    ),
});

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

interface Issue {
  path: PropertyKey[];
  message: string;
}

export const toFieldErrors = <T>(issues: Issue[]): FieldErrors<T> => {
  const fieldErrors: FieldErrors<T> = {};
  for (const issue of issues) {
    const field = issue.path[0] as keyof T | undefined;
    if (field !== undefined && !fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  }
  return fieldErrors;
};
