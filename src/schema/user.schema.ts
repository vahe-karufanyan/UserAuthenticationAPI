import {object, string, TypeOf} from 'zod';

export const createUserSchema = object({
  body: object({
    name: string({
      required_error: "Name is required"
    }),
    surname: string({
      required_error: "Surname is required"
    }),
    password: string({
      required_error: "Password is required"
    }).min(6, "Password is too short, minimum 6 characters"),
    confirmPassword: string({
      required_error: "Password confirmation is required"
    }),
    email: string({
      required_error: "Email is required"
    }).email("Not a valid email"),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
  })
});

export const verifyUserSchema = object({
  params: object({
    id: string(),
    verificationCode: string(),
  })
});

export type CreateUserInput = TypeOf<typeof createUserSchema>["body"];

export type VerifyUserInput = TypeOf<typeof verifyUserSchema>["params"];