const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const { models } = require('../libs/sequelize');

class CustomerService {
  constructor() {}

  async find() {
    const customers = await models.Customer.findAll();
    return customers;
  }

  async findOne(id) {
    const customer = await models.Customer.findByPk(id, {
      include: ['user'],
    });
    if (!customer) {
      throw boom.notFound('customer not found');
    }
    delete customer.user.dataValues.recoveryToken;
    delete customer.user.dataValues.password;
    return customer;
  }

  async create(data) {
    const hashedPassword = await bcrypt.hash(data.user.password, 10);
    const newData = {
      ...data,
      user: {
        ...data.user,
        password: hashedPassword,
      },
    };
    const newCustomer = await models.Customer.create(newData, {
      include: ['user'],
    });
    delete newCustomer.user.dataValues.password;
    delete newCustomer.user.dataValues.recoveryToken;
    return newCustomer;
  }

  async update(id, changes) {
    const customer = await this.findOne(id);
    const updatedCustomer = await customer.update(changes);
    delete customer.user.dataValues.recoveryToken;
    delete customer.user.dataValues.password;
    return updatedCustomer;
  }

  async delete(id) {
    const customer = await this.findOne(id);
    const deletedCustomerId = customer.id;
    await customer.destroy();
    return deletedCustomerId;
  }
}

module.exports = CustomerService;
