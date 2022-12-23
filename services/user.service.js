const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');

const { models } = require('./../libs/sequelize');

class UserService {
  constructor() {}

  async create(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = await models.User.create({
      ...data,
      password: hashedPassword,
    });
    delete newUser.dataValues.password;
    return newUser;
  }

  async find() {
    const users = await models.User.findAll({
      include: ['customer'],
    });
    return users;
  }

  async findOne(id) {
    const user = await models.User.findByPk(id);
    if (!user) {
      throw boom.notFound('user not found');
    }
    delete user.dataValues.password;
    delete user.dataValues.recoveryToken;
    return user;
  }

  async findByEmail(email) {
    const user = models.User.findOne({
      where: { email },
    });
    delete user.dataValues.password;
    delete user.dataValues.recoveryToken;
    return user;
  }

  async update(id, changes) {
    const user = await this.findOne(id);
    const updatedUser = await user.update(changes);
    return updatedUser;
  }

  async delete(id) {
    const user = await this.findOne(id);
    const deletedUserId = await user.destroy();
    return deletedUserId;
  }
}

module.exports = UserService;
