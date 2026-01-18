import 'dotenv/config';

export default {
    development: {
        url: process.env.DATABASE_URL,
        dialect: 'postgres',
        logging: false,
        define: {
            underscored: true,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    },
    test: {
        url: process.env.DATABASE_URL_TEST || process.env.DATABASE_URL,
        dialect: 'postgres',
        logging: false,
        define: {
            underscored: true,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    },
    production: {
        url: process.env.DATABASE_URL,
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        define: {
            underscored: true,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
};
