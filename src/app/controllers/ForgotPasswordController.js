import * as Yup from 'yup';
import { v4 as uuid } from 'uuid';
import { addHours, parseISO, isAfter } from 'date-fns';
import User from '../models/User';

class ForgotPasswordController {
  async update(req, res) {
    const schema = Yup.object().shape({
      token: Yup.string().required(),
      newPassword: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(422).json({ error: 'Validation fails' });
    }

    const userWithRefToken = await User.findOne({
      where: { token_pass: req.body.token },
    });

    if (!userWithRefToken) {
      return res.status(400).json({
        isValid: false,
        error: 'There is no user with this given token',
      });
    }

    console.log('now', new Date());
    console.log('hour of db', userWithRefToken.expired_at_token_pass);

    const isExpiredToken = isAfter(
      new Date(),
      userWithRefToken.expired_at_token_pass
    );

    if (isExpiredToken) {
      return res.status(400).json({
        isValid: false,
        error: 'Token has already expired, try again...',
      });
    }

    userWithRefToken.password = req.body.newPassword;
    userWithRefToken.expired_at_token_pass = null;
    userWithRefToken.token_pass = null;

    await userWithRefToken.save();

    return res.json({
      isValid: true,
    });
  }

  async recover(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(422).json({ error: 'Validation fails' });
    }

    const userExists = await User.findOne({
      where: { email: req.body.email },
    });

    if (!userExists) {
      return res.status(400).json({ error: "User doesn't exists yet" });
    }

    userExists.token_pass = uuid();
    userExists.expired_at_token_pass = addHours(new Date(), 5);

    await userExists.save();

    return res.json({ success: true });
  }
}

export default new ForgotPasswordController();
