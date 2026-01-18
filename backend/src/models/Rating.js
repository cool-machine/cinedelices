import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class Rating extends Model {
        static associate(models) {
            Rating.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user'
            });
            Rating.belongsTo(models.Recipe, {
                foreignKey: 'recipe_id',
                as: 'recipe'
            });
        }
    }

    Rating.init({
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
        stars: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5
            }
        }
    }, {
        sequelize,
        modelName: 'Rating',
        tableName: 'ratings',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                unique: true,
                fields: ['user_id', 'recipe_id']
            }
        ]
    });

    return Rating;
};
