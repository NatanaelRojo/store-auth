const express = require('express');
const passport = require('passport');

const CategoryService = require('./../services/category.service');
const validatorHandler = require('./../middlewares/validator.handler');
const {
  createCategorySchema,
  updateCategorySchema,
  getCategorySchema,
} = require('./../schemas/category.schema');
const { checkAdminRole, checkRoles } = require('../middlewares/auh.handler');

const router = express.Router();
const service = new CategoryService();

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkRoles('customer', 'admin'),
  async (req, res, next) => {
    try {
      const categories = await service.find();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  checkRoles('customer', 'admin'),
  validatorHandler(getCategorySchema, 'params'),
  async (req, res, next) => {
    try {
      const categoryId = parseInt(req.params.id, 10);
      const category = await service.findOne(categoryId);
      res.json(category);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin'),
  validatorHandler(createCategorySchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newCategory = await service.create(body);
      res.status(201).json(newCategory);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  '/:id',
  validatorHandler(getCategorySchema, 'params'),
  validatorHandler(updateCategorySchema, 'body'),
  async (req, res, next) => {
    try {
      const categoryId = parseInt(req.params.id, 10);
      const body = req.body;
      const updatedCategory = await service.update(categoryId, body);
      res.json(updatedCategory);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:id',
  validatorHandler(getCategorySchema, 'params'),
  async (req, res, next) => {
    try {
      constcategoryId = parseInt(req.params.id, 10);
      const deletedCategoryId = await service.delete(categoryId);
      res.json(deletedCategoryId);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
