'use strict';

const argon2 = require('argon2');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Hash password for demo users
        const hashedPassword = await argon2.hash('password123');

        // Insert users
        await queryInterface.bulkInsert('users', [
            {
                email: 'admin@cinedelices.fr',
                password_hash: hashedPassword,
                username: 'admin',
                role: 'admin',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                email: 'user@cinedelices.fr',
                password_hash: hashedPassword,
                username: 'ChefCinema',
                role: 'user',
                created_at: new Date(),
                updated_at: new Date()
            }
        ], {});

        // Insert categories
        await queryInterface.bulkInsert('categories', [
            {
                name: 'Entrée',
                description: 'Plats pour commencer le repas',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Plat principal',
                description: 'Plats de résistance',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Dessert',
                description: 'Douceurs sucrées pour finir le repas',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Boisson',
                description: 'Cocktails et boissons inspirés du cinéma',
                created_at: new Date(),
                updated_at: new Date()
            }
        ], {});

        // Insert media (films and series)
        await queryInterface.bulkInsert('media', [
            {
                title: 'Ratatouille',
                type: 'film',
                image_url: 'https://image.tmdb.org/t/p/w500/npHNjldbeTHdKKw28bJKs7lzqzj.jpg',
                release_year: 2007,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Le Parrain',
                type: 'film',
                image_url: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
                release_year: 1972,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Julie & Julia',
                type: 'film',
                image_url: 'https://image.tmdb.org/t/p/w500/9T0S2X5Z3UWHA0gMJLqZ0E7Xrwq.jpg',
                release_year: 2009,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Breaking Bad',
                type: 'serie',
                image_url: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
                release_year: 2008,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Game of Thrones',
                type: 'serie',
                image_url: 'https://image.tmdb.org/t/p/w500/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg',
                release_year: 2011,
                created_at: new Date(),
                updated_at: new Date()
            }
        ], {});

        // Insert recipes
        await queryInterface.bulkInsert('recipes', [
            {
                title: 'Ratatouille du Chef Gusteau',
                description: 'La célèbre ratatouille du film Pixar, revisitée en tian provençal élégant.',
                ingredients: `- 2 courgettes
- 2 aubergines
- 4 tomates
- 1 poivron rouge
- 1 poivron jaune
- 2 gousses d'ail
- Huile d'olive
- Herbes de Provence
- Sel et poivre`,
                instructions: `1. Préchauffer le four à 180°C.
2. Couper tous les légumes en rondelles fines et régulières.
3. Préparer une sauce tomate avec l'ail et les herbes.
4. Disposer les rondelles de légumes en alternance dans un plat.
5. Arroser d'huile d'olive et assaisonner.
6. Cuire au four pendant 45 minutes.
7. Servir chaud avec un filet d'huile d'olive.`,
                anecdote: 'Dans le film Ratatouille, ce plat simple mais élégant permet à Rémy de conquérir le critique gastronomique Anton Ego et lui rappelle son enfance.',
                difficulty: 'moyen',
                prep_time: 30,
                cook_time: 45,
                image_url: 'https://img.cuisineaz.com/660x660/2013/12/20/i47006-ratatouille.jpeg',
                user_id: 1,
                category_id: 2,
                media_id: 1,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Cannoli Siciliens du Parrain',
                description: 'Les fameux cannoli de la scène culte "Leave the gun, take the cannoli".',
                ingredients: `- 250g de farine
- 25g de sucre
- 30g de saindoux
- 1 œuf
- Vin blanc
- 500g de ricotta
- 150g de sucre glace
- Pépites de chocolat
- Pistaches hachées`,
                instructions: `1. Préparer la pâte avec farine, sucre, saindoux et œuf.
2. Incorporer le vin blanc jusqu'à obtenir une pâte souple.
3. Laisser reposer 1 heure au frais.
4. Étaler finement et découper des cercles.
5. Enrouler autour des tubes à cannoli et frire.
6. Préparer la farce avec ricotta et sucre glace.
7. Farcir les tubes et décorer.`,
                anecdote: 'Cette réplique culte du Parrain est devenue emblématique. Les cannoli sont un symbole de la culture sicilienne présente tout au long du film.',
                difficulty: 'difficile',
                prep_time: 60,
                cook_time: 30,
                image_url: 'https://www.galbani.fr/wp-content/uploads/2020/06/AdobeStock_193854315-1-800x800.jpeg',
                user_id: 1,
                category_id: 3,
                media_id: 2,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Bœuf Bourguignon de Julia Child',
                description: 'Le classique français qui a fait la renommée de Julia Child, immortalisé dans Julie & Julia.',
                ingredients: `- 1.5kg de bœuf à braiser
- 200g de lardons
- 1 bouteille de vin rouge de Bourgogne
- 500g de champignons
- 20 petits oignons
- 3 carottes
- 2 gousses d'ail
- Bouquet garni
- Beurre et farine`,
                instructions: `1. Faire revenir les lardons puis les réserver.
2. Faire dorer les morceaux de bœuf de tous côtés.
3. Ajouter les carottes et l'ail, flamber au cognac.
4. Verser le vin rouge et ajouter le bouquet garni.
5. Cuire à feu doux pendant 3 heures.
6. Faire sauter les champignons et oignons.
7. Les ajouter en fin de cuisson.`,
                anecdote: 'Julia Child a passé des années à perfectionner cette recette pour son livre "Mastering the Art of French Cooking". Le film montre sa passion contagieuse pour la cuisine française.',
                difficulty: 'difficile',
                prep_time: 45,
                cook_time: 180,
                image_url: 'https://assets.afcdn.com/recipe/20161114/26634_w1024h768c1cx2808cy1872.jpg',
                user_id: 2,
                category_id: 2,
                media_id: 3,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Poulet Los Pollos Hermanos',
                description: 'Inspiré du restaurant de Gus Fring dans Breaking Bad. Un poulet frit croustillant à souhait.',
                ingredients: `- 1 poulet découpé
- 500ml de babeurre
- 300g de farine
- 2 cuillères de paprika
- 1 cuillère de poudre d'ail
- 1 cuillère de poudre d'oignon
- Cayenne
- Sel et poivre
- Huile de friture`,
                instructions: `1. Mariner le poulet dans le babeurre pendant 4 heures.
2. Mélanger la farine avec toutes les épices.
3. Égoutter le poulet et le paner dans le mélange.
4. Chauffer l'huile à 170°C.
5. Frire le poulet 12-15 minutes jusqu'à doré.
6. Laisser reposer sur grille.
7. Servir avec sauce piquante.`,
                anecdote: 'Los Pollos Hermanos est la couverture parfaite pour l\'empire de Gus Fring. Le restaurant existe vraiment lors d\'événements promotionnels pour la série!',
                difficulty: 'moyen',
                prep_time: 30,
                cook_time: 20,
                image_url: 'https://assets.epicurious.com/photos/54ad4dbcda5a39e3358c7bda/1:1/w_600/51160410_fried-chicken_1x1.jpg',
                user_id: 2,
                category_id: 2,
                media_id: 4,
                created_at: new Date(),
                updated_at: new Date()
            }
        ], {});
    },

    async down(queryInterface, Sequelize) {
        // Delete in reverse order to respect foreign keys
        await queryInterface.bulkDelete('recipes', null, {});
        await queryInterface.bulkDelete('media', null, {});
        await queryInterface.bulkDelete('categories', null, {});
        await queryInterface.bulkDelete('users', null, {});
    }
};
