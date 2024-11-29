const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 3001;

// Підключення до БД через Sequelize
const dbConfig = new Sequelize('test_db', 'test_user', 'test1234', {
    host: 'localhost', // або IP-адреса сервера
    dialect: 'mssql', // Вказуємо тип бази даних
    port: 1433, // Вкажіть порт, якщо використовується нестандартний
    dialectOptions: {
        options: {
            encrypt: true, // Увімкнути, якщо використовується Azure
            trustServerCertificate: true, // Відключити перевірку сертифіката
        },
    },
});

(async () => {
    try {
        await dbConfig.authenticate(); // Перевірка підключення
        console.log('Підключення до бази даних успішне!');
    } catch (error) {
        console.error('Помилка підключення до бази даних:', error);
        process.exit(1); // Завершити процес у разі помилки підключення
    }
})();

// Визначення моделі для таблиці
const Artifact = dbConfig.define('Artifact', {
    artifact_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    artifact_type: { type: DataTypes.STRING, allowNull: false },
    Recommendation: { type: DataTypes.STRING },
}, { tableName: 'Artifact', timestamps: false });

const ArtifactPassiveSkill = dbConfig.define('ArtifactPassiveSkill', {
    passive_skill_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    parameter_increased: { type: DataTypes.STRING },
    increment_value: { type: DataTypes.FLOAT },
    artifact_id: { type: DataTypes.INTEGER },
}, { tableName: 'ArtifactPassiveSkill', timestamps: false });

const Weapon = dbConfig.define('Weapon', {
    weapon_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    weapon_type: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
}, { tableName: 'Weapon', timestamps: false });

const WeaponPassiveSkill = dbConfig.define('WeaponPassiveSkill', {
    passive_skill_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    parameter_increased: { type: DataTypes.STRING },
    increment_value: { type: DataTypes.FLOAT },
    weapon_id: { type: DataTypes.INTEGER },
}, { tableName: 'WeaponPassiveSkill', timestamps: false });

const Character = dbConfig.define('Character', {
    character_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    weapon_type: { type: DataTypes.STRING },
    element: { type: DataTypes.STRING },
    hp: { type: DataTypes.INTEGER },
    attack_count: { type: DataTypes.INTEGER },
    weapon_id: { type: DataTypes.INTEGER },
    artifact_id: { type: DataTypes.INTEGER },
}, { tableName: 'Character', timestamps: false });

// Включаємо CORS для доступу до API
app.use(cors());
app.use(bodyParser.json());

// Маршрут для таблиці артефактів
app.get('/api/artifacts', async (req, res) => {
    try {
        const artifacts = await Artifact.findAll();
        res.json(artifacts);
    } catch (error) {
        console.error('Помилка отримання даних з Artifact:', error);
        res.status(500).json({ message: 'Помилка отримання даних з Artifact' });
    }
});

app.get('/api/artifact-passive-skills', async (req, res) => {
    try {
        const artifactPassiveSkills = await ArtifactPassiveSkill.findAll();
        res.json(artifactPassiveSkills);
    } catch (error) {
        console.error('Помилка отримання даних з ArtifactPassiveSkill:', error);
        res.status(500).json({ message: 'Помилка отримання даних з ArtifactPassiveSkill' });
    }
});

// Маршрут для таблиці зброї
app.get('/api/weapons', async (req, res) => {
    try {
        const weapons = await Weapon.findAll();
        res.json(weapons);
    } catch (error) {
        console.error('Помилка отримання даних з Weapon:', error);
        res.status(500).json({ message: 'Помилка отримання даних з Weapon' });
    }
});

app.get('/api/weapon-passive-skills', async (req, res) => {
    try {
        const weaponPassiveSkills = await WeaponPassiveSkill.findAll();
        res.json(weaponPassiveSkills);
    } catch (error) {
        console.error('Помилка отримання даних з WeaponPassiveSkill:', error);
        res.status(500).json({ message: 'Помилка отримання даних з WeaponPassiveSkill' });
    }
});

// Маршрут для таблиці персонажів
app.get('/api/characters', async (req, res) => {
    try {
        const characters = await Character.findAll();
        res.json(characters);
    } catch (error) {
        console.error('Помилка отримання даних з Character:', error);
        res.status(500).json({ message: 'Помилка отримання даних з Character' });
    }
});

// Процедура оновлення рекомендацій
app.post('/api/artifacts/update-recommendations', async (req, res) => {
    try {
        console.log('Спроба виклику UpdateAllArtifactRecommendations...');
        await dbConfig.query('EXEC UpdateAllArtifactRecommendations');
        console.log('Рекомендації успішно оновлені.');
        res.status(200).json({ message: 'Рекомендації для артефактів успішно оновлені.' });
    } catch (error) {
        console.error('Помилка при оновленні рекомендацій:', error.message);
        res.status(500).json({ message: 'Помилка при оновленні рекомендацій.' });
    }
});

// Запит для отримання характеристик персонажа
app.get('/api/character-stat', async (req, res) => {
    const { characterName, weaponName } = req.query;

    try {
        console.log(`Запит параметрів: characterName=${characterName}, weaponName=${weaponName}`);

        const result = await dbConfig.query(
            `SELECT dbo.GetCharacterStatByPassiveSkill(:characterName, :weaponName) AS result`,
            {
                replacements: { characterName, weaponName },
                type: dbConfig.QueryTypes.SELECT,
            }
        );

        console.log('Результат функції:', result);
        res.status(200).json({ message: result[0].result });
    } catch (error) {
        console.error('Помилка виклику функції GetCharacterStatByPassiveSkill:', error);
        res.status(500).json({ message: 'Помилка виконання функції.' });
    }
});

// Запит для отримання всіх характеристик персонажів
app.get('/api/all-character-stats', async (req, res) => {
    try {
        const result = await dbConfig.query('SELECT * FROM dbo.GetAllCharacterStats()', {
            type: dbConfig.QueryTypes.SELECT,
        });
        res.status(200).json(result);
    } catch (error) {
        console.error('Помилка виклику функції GetAllCharacterStats:', error);
        res.status(500).json({ message: 'Помилка виконання функції.' });
    }
});

// Налаштування сервера
app.get('/', (req, res) => {
    res.send('Сервер працює...');
});

app.listen(PORT, () => {
    console.log(`Сервер запущено на порту ${PORT}`);
});
