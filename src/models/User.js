import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         */
        static associate(models) {
            // User has many recipes
            User.hasMany(models.Recipe, {
                foreignKey: 'user_id',
                as: 'recipes'
            });
        }

        /**
         * Check if user is admin
         */
        isAdmin() {
            return this.role === 'admin';
        }
    }

    User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        username: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                len: [3, 100]
            }
        },
        role: {
            type: DataTypes.ENUM('user', 'admin'),
            allowNull: false,
            defaultValue: 'user'
        }
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return User;
};
