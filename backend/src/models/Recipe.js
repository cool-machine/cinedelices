import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class Recipe extends Model {
        /**
         * Helper method for defining associations.
         */
        static associate(models) {
            // Recipe belongs to User
            Recipe.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'author',
                onDelete: 'CASCADE'
            });

            // Recipe belongs to Category
            Recipe.belongsTo(models.Category, {
                foreignKey: 'category_id',
                as: 'category',
                onDelete: 'SET NULL'
            });

            // Recipe belongs to Media
            Recipe.belongsTo(models.Media, {
                foreignKey: 'media_id',
                as: 'media',
                onDelete: 'SET NULL'
            });

            // Recipe has many Ratings
            Recipe.hasMany(models.Rating, {
                foreignKey: 'recipe_id',
                as: 'ratings',
                onDelete: 'CASCADE'
            });

            // Recipe has many Reviews
            Recipe.hasMany(models.Review, {
                foreignKey: 'recipe_id',
                as: 'reviews',
                onDelete: 'CASCADE'
            });

            // Recipe has many Favorites
            Recipe.hasMany(models.Favorite, {
                foreignKey: 'recipe_id',
                as: 'favorites',
                onDelete: 'CASCADE'
            });
        }

        /**
         * Get total time (prep + cook)
         */
        getTotalTime() {
            return (this.prep_time || 0) + (this.cook_time || 0);
        }
    }

    Recipe.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        ingredients: {
            type: DataTypes.TEXT,
            allowNull: false,
            comment: 'Stored as text (list format as per MVP requirements)'
        },
        instructions: {
            type: DataTypes.TEXT,
            allowNull: false,
            comment: 'Step-by-step cooking instructions'
        },
        anecdote: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Fun fact or story about the recipe and its film/series connection'
        },
        difficulty: {
            type: DataTypes.ENUM('facile', 'moyen', 'difficile'),
            allowNull: false,
            defaultValue: 'moyen'
        },
        prep_time: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Preparation time in minutes'
        },
        cook_time: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Cooking time in minutes'
        },
        image_url: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'categories',
                key: 'id'
            }
        },
        media_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'media',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'Recipe',
        tableName: 'recipes',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Recipe;
};
