import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class Media extends Model {
        /**
         * Helper method for defining associations.
         */
        static associate(models) {
            // Media has many recipes
            Media.hasMany(models.Recipe, {
                foreignKey: 'media_id',
                as: 'recipes',
                onDelete: 'SET NULL'
            });
        }
    }

    Media.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('film', 'serie'),
            allowNull: false
        },
        image_url: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        release_year: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 1900,
                max: 2100
            }
        }
    }, {
        sequelize,
        modelName: 'Media',
        tableName: 'media',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Media;
};
