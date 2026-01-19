import 'dotenv/config';

export const buildConfig = () => ({
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
});

const config = buildConfig();

export default config;
