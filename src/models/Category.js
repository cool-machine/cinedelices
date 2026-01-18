import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class Category extends Model {
        /**
         * Helper method for defining associations.
         */
        static associate(models) {
            // Category has many recipes
            Category.hasMany(models.Recipe, {
                foreignKey: 'category_id',
                as: 'recipes',
                onDelete: 'SET NULL'
            });
        }
    }

    Category.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Category',
        tableName: 'categories',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Category;
};
