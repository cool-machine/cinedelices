import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class Review extends Model {
        static associate(models) {
            Review.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'author'
            });
            Review.belongsTo(models.Recipe, {
                foreignKey: 'recipe_id',
                as: 'recipe'
            });
        }
    }

    Review.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        recipe_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'recipes',
                key: 'id'
            }
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: [10, 2000]
            }
        }
    }, {
        sequelize,
        modelName: 'Review',
        tableName: 'reviews',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Review;
};
