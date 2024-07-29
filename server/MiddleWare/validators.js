import Joi from 'joi'

export const initialDetailsSchema = Joi.object({
    username: Joi.string().min(5).max(20).required(),
    password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#\$%^&*]).{8,20}$')).required()
});

export const updateUserSchema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    phoneNumber: Joi.string().pattern(new RegExp('^[0-9\-\+\s]{7,14}$')).required()
});

const initialDriver = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    phoneNumber: Joi.string().pattern(new RegExp('^[0-9\-\+\s]{7,14}$')).required(),
    idNumber: Joi.string().pattern(new RegExp('^[0-9]{9}$')).required(),
    companyId: Joi.number().integer().min(1).required()
});

const driver = Joi.object({
    username: Joi.string().min(5).max(20).required(),
    name: Joi.string().min(3).max(20).required(),
    phoneNumber: Joi.string().pattern(new RegExp('^[0-9\-\+\s]{7,14}$')).required(),
    companyId: Joi.number().integer().min(1).required()
});

const password = Joi.object({
    oldPassword: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#\$%^&*]).{8,20}$')).required(),
    newPassword: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#\$%^&*]).{8,20}$')).required()
});

export const updateDriverSchema = Joi.alternatives().try(
    initialDriver,
    driver,
    password
).required();

export const orderSchema = Joi.object({
    location: Joi.object({
        latitude: Joi.number().required(),
        longitude: Joi.number().required()
    }).required(),
    destination: Joi.object({
        latitude: Joi.number().required(),
        longitude: Joi.number().required()
    }).required(),
    userId: Joi.number().integer().min(1).required()
});

export const patchDriverSchema = Joi.object({
    location: Joi.object({
        latitude: Joi.number().required(),
        longitude: Joi.number().required()
    }),
    available: Joi.boolean()
}).or('location', 'available').required();