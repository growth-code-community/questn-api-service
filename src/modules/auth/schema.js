import Joi from "joi";

export const signUpSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).max(256).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).max(256).required(),
});
