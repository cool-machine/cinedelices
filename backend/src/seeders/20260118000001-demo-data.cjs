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

        // Insert media (films and series) - 14 total for rich carousel
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
            },
            {
                title: 'Pulp Fiction',
                type: 'film',
                image_url: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
                release_year: 1994,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Amélie',
                type: 'film',
                image_url: 'https://image.tmdb.org/t/p/w500/nSxDa3ppafARKLYnuX6PZvSdAq6.jpg',
                release_year: 2001,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Chocolat',
                type: 'film',
                image_url: 'https://image.tmdb.org/t/p/w500/7vMBFraC8EaBQ8R3mI4Z8BJ6sSP.jpg',
                release_year: 2000,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Big Night',
                type: 'film',
                image_url: 'https://image.tmdb.org/t/p/w500/iDmwFPqOzKfbj8nJE3TpxfSb8JX.jpg',
                release_year: 1996,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Babette\'s Feast',
                type: 'film',
                image_url: 'https://image.tmdb.org/t/p/w500/nW2ry2E3p6F8q8R9cpf8N6l4lgB.jpg',
                release_year: 1987,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Eat Drink Man Woman',
                type: 'film',
                image_url: 'https://image.tmdb.org/t/p/w500/j5dJQS4ZXqOp1oJYq8P7M3pK3g.jpg',
                release_year: 1994,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'The Grand Budapest Hotel',
                type: 'film',
                image_url: 'https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrP1.jpg',
                release_year: 2014,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Jiro Dreams of Sushi',
                type: 'film',
                image_url: 'https://image.tmdb.org/t/p/w500/vIMF1aq1AaGR0hJtU8Y8wvJdNMo.jpg',
                release_year: 2011,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Willy Wonka',
                type: 'film',
                image_url: 'https://image.tmdb.org/t/p/w500/vmPycNyXLnoDFcaVEFXa4S6bh6k.jpg',
                release_year: 1971,
                created_at: new Date(),
                updated_at: new Date()
            }
        ], {});

        // Query actual IDs from inserted users, categories, and media
        const [users] = await queryInterface.sequelize.query(
            `SELECT id, email FROM users ORDER BY id`
        );
        const [categories] = await queryInterface.sequelize.query(
            `SELECT id, name FROM categories ORDER BY id`
        );
        const [media] = await queryInterface.sequelize.query(
            `SELECT id, title FROM media ORDER BY id`
        );

        // Map to get IDs
        const adminUser = users.find(u => u.email === 'admin@cinedelices.fr');
        const regularUser = users.find(u => u.email === 'user@cinedelices.fr');
        const entree = categories.find(c => c.name === 'Entrée');
        const platPrincipal = categories.find(c => c.name === 'Plat principal');
        const dessert = categories.find(c => c.name === 'Dessert');
        const boisson = categories.find(c => c.name === 'Boisson');

        // Get all media IDs
        const ratatouilleMedia = media.find(m => m.title === 'Ratatouille');
        const parrainMedia = media.find(m => m.title === 'Le Parrain');
        const juliaMedia = media.find(m => m.title === 'Julie & Julia');
        const breakingBadMedia = media.find(m => m.title === 'Breaking Bad');
        const gotMedia = media.find(m => m.title === 'Game of Thrones');
        const pulpMedia = media.find(m => m.title === 'Pulp Fiction');
        const amelieMedia = media.find(m => m.title === 'Amélie');
        const chocolatMedia = media.find(m => m.title === 'Chocolat');
        const bigNightMedia = media.find(m => m.title === 'Big Night');
        const babetteMedia = media.find(m => m.title === 'Babette\'s Feast');
        const eatDrinkMedia = media.find(m => m.title === 'Eat Drink Man Woman');
        const budapestMedia = media.find(m => m.title === 'The Grand Budapest Hotel');
        const jiroMedia = media.find(m => m.title === 'Jiro Dreams of Sushi');
        const wonkaMedia = media.find(m => m.title === 'Willy Wonka');

        // Insert 14 recipes with Unsplash images
        await queryInterface.bulkInsert('recipes', [
            // === NOW PLAYING (first 4) ===
            {
                title: 'Ratatouille du Chef Gusteau',
                description: 'La célèbre ratatouille du film Pixar, revisitée en tian provençal élégant.',
                ingredients: `- 2 courgettes\n- 2 aubergines\n- 4 tomates\n- 1 poivron rouge\n- Huile d'olive\n- Herbes de Provence`,
                instructions: `1. Préchauffer le four à 180°C.\n2. Couper les légumes en rondelles fines.\n3. Disposer en alternance dans un plat.\n4. Cuire au four 45 minutes.`,
                anecdote: 'Ce plat permet à Rémy de conquérir le critique Anton Ego.',
                difficulty: 'moyen',
                prep_time: 30,
                cook_time: 45,
                image_url: 'https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?w=600&q=80',
                user_id: adminUser.id,
                category_id: platPrincipal.id,
                media_id: ratatouilleMedia.id,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Cannoli Siciliens du Parrain',
                description: 'Les fameux cannoli de la scène "Leave the gun, take the cannoli".',
                ingredients: `- 250g de farine\n- 500g de ricotta\n- 150g de sucre glace\n- Pépites de chocolat`,
                instructions: `1. Préparer la pâte.\n2. Frire les tubes.\n3. Farcir avec ricotta sucrée.\n4. Décorer.`,
                anecdote: 'Réplique culte du Parrain devenue emblématique.',
                difficulty: 'difficile',
                prep_time: 60,
                cook_time: 30,
                image_url: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&q=80',
                user_id: adminUser.id,
                category_id: dessert.id,
                media_id: parrainMedia.id,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Bœuf Bourguignon de Julia Child',
                description: 'Le classique français immortalisé dans Julie & Julia.',
                ingredients: `- 1.5kg de bœuf\n- 1 bouteille de vin rouge\n- 500g de champignons\n- Lardons`,
                instructions: `1. Faire revenir les lardons.\n2. Dorer le bœuf.\n3. Ajouter le vin.\n4. Cuire 3 heures.`,
                anecdote: 'Julia Child a perfectionné cette recette pendant des années.',
                difficulty: 'difficile',
                prep_time: 45,
                cook_time: 180,
                image_url: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=600&q=80',
                user_id: regularUser.id,
                category_id: platPrincipal.id,
                media_id: juliaMedia.id,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Poulet Los Pollos Hermanos',
                description: 'Inspiré du restaurant de Gus Fring dans Breaking Bad.',
                ingredients: `- 1 poulet découpé\n- 500ml de babeurre\n- 300g de farine\n- Épices secrètes`,
                instructions: `1. Mariner 4 heures.\n2. Paner dans la farine épicée.\n3. Frire 15 minutes.\n4. Servir chaud.`,
                anecdote: 'Los Pollos Hermanos existe vraiment lors d\'événements promos!',
                difficulty: 'moyen',
                prep_time: 30,
                cook_time: 20,
                image_url: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&q=80',
                user_id: regularUser.id,
                category_id: platPrincipal.id,
                media_id: breakingBadMedia.id,
                created_at: new Date(),
                updated_at: new Date()
            },
            // === COMING SOON CAROUSEL (recipes 5-14) ===
            {
                title: 'Pigeon en Croûte de Winterfell',
                description: 'Un plat royal digne des banquets de Westeros.',
                ingredients: `- 2 pigeons\n- 400g pâte feuilletée\n- 200g foie gras\n- Champignons des bois`,
                instructions: `1. Désosser les pigeons.\n2. Envelopper en croûte.\n3. Cuire 25 min à 200°C.`,
                anecdote: 'Les festins de Game of Thrones sont légendaires.',
                difficulty: 'difficile',
                prep_time: 45,
                cook_time: 25,
                image_url: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=600&q=80',
                user_id: adminUser.id,
                category_id: platPrincipal.id,
                media_id: gotMedia.id,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Le Big Kahuna Burger',
                description: 'Le fameux burger de Pulp Fiction. "That is a tasty burger!"',
                ingredients: `- 500g bœuf haché\n- 4 pains briochés\n- Fromage américain\n- Bacon`,
                instructions: `1. Former les steaks.\n2. Cuire sur grill.\n3. Assembler avec garnitures.\n4. Servir avec milkshake.`,
                anecdote: 'Scène emblématique avec Samuel L. Jackson.',
                difficulty: 'facile',
                prep_time: 15,
                cook_time: 10,
                image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
                user_id: regularUser.id,
                category_id: platPrincipal.id,
                media_id: pulpMedia.id,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Crème Brûlée d\'Amélie',
                description: 'Le dessert préféré d\'Amélie Poulain.',
                ingredients: `- 500ml crème fraîche\n- 6 jaunes d'œufs\n- 100g sucre\n- Vanille`,
                instructions: `1. Faire infuser vanille.\n2. Mélanger aux jaunes.\n3. Cuire au bain-marie.\n4. Caraméliser au chalumeau.`,
                anecdote: 'Amélie adore casser la croûte de sa crème brûlée.',
                difficulty: 'moyen',
                prep_time: 20,
                cook_time: 45,
                image_url: 'https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?w=600&q=80',
                user_id: adminUser.id,
                category_id: dessert.id,
                media_id: amelieMedia.id,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Truffes au Chocolat',
                description: 'Les truffes sensuelles du film Chocolat.',
                ingredients: `- 200g chocolat noir\n- 200ml crème fraîche\n- Cacao en poudre\n- Piment secret`,
                instructions: `1. Fondre le chocolat.\n2. Mélanger à la crème.\n3. Former des boules.\n4. Rouler dans le cacao.`,
                anecdote: 'Une touche de piment était le secret de Vianne.',
                difficulty: 'facile',
                prep_time: 30,
                cook_time: 0,
                image_url: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=600&q=80',
                user_id: regularUser.id,
                category_id: dessert.id,
                media_id: chocolatMedia.id,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Timpano de Big Night',
                description: 'Le festin italien légendaire du film Big Night.',
                ingredients: `- Pâtes\n- Viande\n- Œufs durs\n- Sauce tomate\n- Mozzarella`,
                instructions: `1. Préparer les pâtes.\n2. Assembler en couches dans un moule.\n3. Cuire au four 1h.\n4. Démouler et servir.`,
                anecdote: 'Le Timpano est le point culminant du film.',
                difficulty: 'difficile',
                prep_time: 90,
                cook_time: 60,
                image_url: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80',
                user_id: adminUser.id,
                category_id: platPrincipal.id,
                media_id: bigNightMedia.id,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Le Festin de Babette',
                description: 'Le repas français somptueux du chef Babette.',
                ingredients: `- Cailles en sarcophage\n- Blinis Demidoff\n- Vin de Chablis\n- Champagne`,
                instructions: `1. Préparer les cailles.\n2. Servir les blinis.\n3. Accompagner de champagne.\n4. Finir par les desserts.`,
                anecdote: 'Babette dépense tout son argent pour ce festin.',
                difficulty: 'difficile',
                prep_time: 120,
                cook_time: 90,
                image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
                user_id: regularUser.id,
                category_id: platPrincipal.id,
                media_id: babetteMedia.id,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Dim Sum du Père Chu',
                description: 'Les délices chinois de Eat Drink Man Woman.',
                ingredients: `- Porc haché\n- Crevettes\n- Pâte à wonton\n- Gingembre\n- Sauce soja`,
                instructions: `1. Préparer la farce.\n2. Former les dim sum.\n3. Cuire à la vapeur 10 min.\n4. Servir avec sauce.`,
                anecdote: 'Le chef Chu prépare des festins dominicaux pour sa famille.',
                difficulty: 'moyen',
                prep_time: 45,
                cook_time: 15,
                image_url: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&q=80',
                user_id: adminUser.id,
                category_id: entree.id,
                media_id: eatDrinkMedia.id,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Mendl\'s Courtesan au Chocolat',
                description: 'La pâtisserie signature du Grand Budapest Hotel.',
                ingredients: `- Pâte à choux\n- Crème pâtissière\n- Chocolat\n- Sucre glace`,
                instructions: `1. Préparer la pâte à choux.\n2. Former les éclairs.\n3. Cuire et refroidir.\n4. Garnir et glacer au chocolat.`,
                anecdote: 'Mendl\'s est la pâtisserie favorite de Madame D.',
                difficulty: 'difficile',
                prep_time: 60,
                cook_time: 30,
                image_url: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&q=80',
                user_id: regularUser.id,
                category_id: dessert.id,
                media_id: budapestMedia.id,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Sushi Omakase de Jiro',
                description: 'L\'art du sushi selon le maître Jiro Ono.',
                ingredients: `- Riz à sushi\n- Poisson ultra-frais\n- Wasabi\n- Gingembre mariné`,
                instructions: `1. Préparer le riz parfait.\n2. Découper le poisson.\n3. Former les nigiri.\n4. Servir immédiatement.`,
                anecdote: 'Jiro a consacré sa vie à perfectionner le sushi.',
                difficulty: 'difficile',
                prep_time: 45,
                cook_time: 0,
                image_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80',
                user_id: adminUser.id,
                category_id: platPrincipal.id,
                media_id: jiroMedia.id,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                title: 'Barre de Chocolat Wonka',
                description: 'Le chocolat magique de l\'usine de Willy Wonka.',
                ingredients: `- 300g chocolat au lait\n- 100g praliné\n- Noisettes\n- Paillettes d'or comestibles`,
                instructions: `1. Tempérer le chocolat.\n2. Ajouter le praliné.\n3. Mouler et décorer.\n4. Chercher le ticket d'or!`,
                anecdote: 'Wonka cache des tickets d\'or dans ses barres.',
                difficulty: 'moyen',
                prep_time: 40,
                cook_time: 0,
                image_url: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=600&q=80',
                user_id: regularUser.id,
                category_id: dessert.id,
                media_id: wonkaMedia.id,
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
