import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        token_pass: Sequelize.STRING,
        expired_at_token_pass: Sequelize.DATE,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    this.addHook('beforeSave', user => {
      console.log('estou salvando');

      if (user.password) {
        user.password_hash = bcrypt.hashSync(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, {
      foreignKey: 'avatar_id',
      as: 'avatar',
    });
  }

  checkPassword(password) {
    return bcrypt.compareSync(password, this.password_hash);
  }
}

export default User;
