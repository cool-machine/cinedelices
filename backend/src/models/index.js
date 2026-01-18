import { readdirSync } from 'fs';
import { basename as _basename, join, dirname } from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import { fileURLToPath } from 'url';
import config from '../config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const basename = _basename(__filename);
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];
const db = {};

let sequelize;
if (dbConfig.url) {
    sequelize = new Sequelize(dbConfig.url, dbConfig);
} else {
    sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
}

// Dynamically import all model files
const modelFiles = readdirSync(__dirname)
    .filter(file => {
        return (
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.js' &&
            file.indexOf('.test.js') === -1
        );
    });

for (const file of modelFiles) {
    const modelModule = await import(join(__dirname, file));
    const model = modelModule.default(sequelize, DataTypes);
    db[model.name] = model;
}

// Set up associations
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
