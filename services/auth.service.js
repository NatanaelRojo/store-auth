const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { config } = require('../config/config');
const UserService = require('./user.service');

const service = new UserService();

class AuthService {
  constructor() {}

  async checkUser(email, password) {
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw boom.unauthorized();
    }
    delete user.dataValues.password;
    return user;
  }

  signToken(user) {
    const payload = {
      sub: user.id,
      role: user.role,
    };
    const token = jwt.sign(payload, config.jwtSecret);
    return token;
  }

  async sendRecovery(email) {
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }

    const payload = {
      sub: user.id,
    };

    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '15min' });
    await service.update(user.id, { recoveryToken: token });
    const link = `http://myfrontend.com/recovery?token=${token}`;
    const mailInfo = {
      from: config.email,
      to: user.email,
      subject: 'Password Recovery',
      html: `<b>Click this link to recover your password: ${link}</b>`,
    };
    const response = await this.sendMail(mailInfo);
    return response;
  }

  async changePassword(token, newPassword) {
    const payload = jwt.verify(token, config.jwtSecret);
    const user = await service.findOne(payload.sub);
    if (token !== user.recoveryToken) {
      throw boom.unauthorized();
    }
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    await service.update(user.id, {
      recoveryToken: null,
      password: newHashedPassword,
    });
    return { message: 'Password has changed' };
  }

  async sendMail(mailInfo) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: config.email,
        pass: config.emailPassword,
      },
    });

    await transporter.sendMail(mailInfo);
    return { message: 'Mail sent' };
  }
}

module.exports = AuthService;
