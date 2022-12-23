const express = require('express');

const CustomerService = require('../services/customers.service');
const validationHandler = require('../middlewares/validator.handler');
const {
  createCustomerSchema,
  getCustomerSchema,
  updateCustomerSchema,
} = require('../schemas/customer.schema');
const validatorHandler = require('../middlewares/validator.handler');

const router = express.Router();
const service = new CustomerService();

router.get('/', async (req, res, next) => {
  try {
    const customers = await service.find();
    res.json(customers);
  } catch (error) {
    next(error);
  }
});

router.get(
  '/:id',
  validatorHandler(getCustomerSchema, 'body'),
  async (req, res, next) => {
    try {
      const customerId = parseInt(req.params.id, 10);
      const customer = await service.findOne(customerId);
      res.status(200).json(customer);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  validationHandler(createCustomerSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newCustomer = await service.create(body);
      res.json(newCustomer);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:id',
  validationHandler(getCustomerSchema, 'params'),
  validationHandler(updateCustomerSchema, 'body'),
  async (req, res, next) => {
    try {
      const customerId = parseInt(req.params.id, 10);
      const body = req.body;
      const updatedCustomer = await service.update(customerId, body);
      res.json(updatedCustomer);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id',
  validationHandler(getCustomerSchema, 'params'),
  async (req, res, next) => {
    try {
      const customerId = parseInt(req.params.id, 10);
      const deletedCustomerId = await service.delete(customerId);
      res.json(deletedCustomerId);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
