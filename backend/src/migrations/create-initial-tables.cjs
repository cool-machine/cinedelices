'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Create users table
        await queryInterface.createTable('users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            email: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true
            },
            password_hash: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            username: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true
            },
            role: {
                type: Sequelize.ENUM('user', 'admin'),
                allowNull: false,
                defaultValue: 'user'
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

        // Create categories table
        await queryInterface.createTable('categories', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

        // Create media table
        await queryInterface.createTable('media', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            title: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            type: {
                type: Sequelize.ENUM('film', 'serie'),
                allowNull: false
            },
            image_url: {
                type: Sequelize.STRING(500),
                allowNull: true
            },
            release_year: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

        // Create recipes table
        await queryInterface.createTable('recipes', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            title: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            ingredients: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            instructions: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            anecdote: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            difficulty: {
                type: Sequelize.ENUM('facile', 'moyen', 'difficile'),
                allowNull: false,
                defaultValue: 'moyen'
            },
            prep_time: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            cook_time: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            image_url: {
                type: Sequelize.STRING(500),
                allowNull: true
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            category_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'categories',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            media_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'media',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });

        // Add indexes for performance
        await queryInterface.addIndex('recipes', ['user_id']);
        await queryInterface.addIndex('recipes', ['category_id']);
        await queryInterface.addIndex('recipes', ['media_id']);
        await queryInterface.addIndex('recipes', ['title']);
        await queryInterface.addIndex('users', ['email']);
    },

    async down(queryInterface, Sequelize) {
        // Drop tables in reverse order (respect foreign keys)
        await queryInterface.dropTable('recipes');
        await queryInterface.dropTable('media');
        await queryInterface.dropTable('categories');
        await queryInterface.dropTable('users');
    }
};
