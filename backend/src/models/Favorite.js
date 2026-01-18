import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class Favorite extends Model {
        static associate(models) {
            Favorite.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user'
            });
            Favorite.belongsTo(models.Recipe, {
                foreignKey: 'recipe_id',
                as: 'recipe'
            });
        }
    }

    Favorite.init({
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
        }
    }, {
        sequelize,
        modelName: 'Favorite',
        tableName: 'favorites',
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

    return Favorite;
};
