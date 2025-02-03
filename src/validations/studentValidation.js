import Joi from 'joi';

export const registerSchema = Joi.object({
  username: Joi.string().min(5).max(10).required(),
  email: Joi.string().email().required(),
  number: Joi.string().pattern(/^\d+$/).required().messages({
    'string.pattern.base': 'Number must only contain digits.',
  }),
  password: Joi.string().min(5).max(15).required(),
  birth: Joi.date().required(), // Use Joi.date() for date of birth validation
  gender: Joi.string().valid('male', 'female').required(), // Define acceptable values
  address: Joi.string().min(5).required(), // General string validation
  school: Joi.string().min(2).required(),
  grade: Joi.string().min(1).max(10).required(), // Specify min/max length or valid grades
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const updateUserSchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().min(6),
  username: Joi.string().min(3),
});
