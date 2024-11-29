import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './info.css';

function Info() {
    const [artifactData, setArtifactData] = useState([]);
    const [passiveSkillData, setPassiveSkillData] = useState([]);
    const [weaponData, setWeaponData] = useState([]);
    const [weaponPassiveSkillData, setWeaponPassiveSkillData] = useState([]);
    const [activeTable, setActiveTable] = useState(1);
    const [characterName, setCharacterName] = useState('');
    const [weaponName, setWeaponName] = useState('');
    const [statResult, setStatResult] = useState('');
    const [allCharacterStats, setAllCharacterStats] = useState([]);

    // Функція для оновлення рекомендацій
    const updateRecommendations = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/artifacts/update-recommendations');
            alert(response.data.message); // Повідомляємо користувача про успішне оновлення
            fetchArtifacts(); // Перезавантаження даних після оновлення
        } catch (error) {
            console.error('Помилка при оновленні рекомендацій:', error);
            alert('Помилка при оновленні рекомендацій.');
        }
    };

    // Завантаження даних артефактів
    const fetchArtifacts = async () => {
        try {
            const artifactsResponse = await axios.get('http://localhost:3001/api/artifacts');
            setArtifactData(artifactsResponse.data);

            const passiveSkillsResponse = await axios.get('http://localhost:3001/api/artifact-passive-skills');
            setPassiveSkillData(passiveSkillsResponse.data);
        } catch (error) {
            console.error('Помилка при завантаженні даних артефактів:', error);
        }
    };

    // Завантаження даних зброї
    const fetchWeapons = async () => {
        try {
            const weaponsResponse = await axios.get('http://localhost:3001/api/weapons');
            setWeaponData(weaponsResponse.data);

            const weaponPassiveSkillsResponse = await axios.get('http://localhost:3001/api/weapon-passive-skills');
            setWeaponPassiveSkillData(weaponPassiveSkillsResponse.data);
        } catch (error) {
            console.error('Помилка при завантаженні даних зброї:', error);
        }
    };

    // Завантаження даних персонажів
    const fetchCharacters = async () => {
        try {
            const charactersResponse = await axios.get('http://localhost:3001/api/characters');
            setArtifactData(charactersResponse.data);
        } catch (error) {
            console.error('Помилка при завантаженні даних персонажів:', error);
        }
    };

    // Завантаження статистики конкретного персонажа
    const fetchCharacterStat = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/character-stat', {
                params: {
                    characterName,
                    weaponName,
                },
            });
            setStatResult(response.data.message); // Зберігаємо результат у стан
        } catch (error) {
            console.error('Помилка при виклику функції:', error);
            alert('Помилка при виклику функції.');
        }
    };

    // Завантаження всіх характеристик персонажів
    const fetchAllCharacterStats = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/all-character-stats');
            setAllCharacterStats(response.data); // Зберігаємо дані у стан
        } catch (error) {
            console.error('Помилка при завантаженні даних:', error);
            alert('Помилка при виконанні функції.');
        }
    };

    // Викликається при зміні активної таблиці
    useEffect(() => {
        if (activeTable === 1) {
            fetchArtifacts();
        } else if (activeTable === 2) {
            fetchWeapons();
        } else if (activeTable === 3) {
            fetchCharacters();
        } else if (activeTable === 4) {
            fetchAllCharacterStats();
        }
    }, [activeTable]);

    // Рендер таблиці артефактів
    const renderArtifacts = () => (
        <>
            <div className="artifacts-header">
                <button className="update-recommendations-btn" onClick={updateRecommendations}>
                    Оновити рекомендації
                </button>
            </div>
            <table className="artifacts-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Тип артефакту</th>
                        <th>Рекомендація</th>
                    </tr>
                </thead>
                <tbody>
                    {artifactData.map((item) => (
                        <tr key={item.artifact_id}>
                            <td>{item.artifact_id}</td>
                            <td>{item.artifact_type}</td>
                            <td>{item.Recommendation}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <table className="artifact-passive-skills-table">
                <thead>
                    <tr>
                        <th>ID пасивки</th>
                        <th>Параметр збільшення</th>
                        <th>Значення збільшення</th>
                        <th>ID артефакту</th>
                    </tr>
                </thead>
                <tbody>
                    {passiveSkillData.map((item) => (
                        <tr key={item.passive_skill_id}>
                            <td>{item.passive_skill_id}</td>
                            <td>{item.parameter_increased}</td>
                            <td>{item.increment_value}</td>
                            <td>{item.artifact_id}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );

    // Рендер таблиці зброї
    const renderWeapons = () => (
        <>
            <table className="weapons-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Тип зброї</th>
                        <th>Назва</th>
                    </tr>
                </thead>
                <tbody>
                    {weaponData.map((item) => (
                        <tr key={item.weapon_id}>
                            <td>{item.weapon_id}</td>
                            <td>{item.weapon_type}</td>
                            <td>{item.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <table className="weapon-passive-skills-table">
                <thead>
                    <tr>
                        <th>ID пасивки</th>
                        <th>Параметр збільшення</th>
                        <th>Значення збільшення</th>
                        <th>ID зброї</th>
                    </tr>
                </thead>
                <tbody>
                    {weaponPassiveSkillData.map((item) => (
                        <tr key={item.passive_skill_id}>
                            <td>{item.passive_skill_id}</td>
                            <td>{item.parameter_increased}</td>
                            <td>{item.increment_value}</td>
                            <td>{item.weapon_id}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="stat-form">
                <input
                    type="text"
                    placeholder="Ім'я персонажа"
                    value={characterName}
                    onChange={(e) => setCharacterName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Назва зброї"
                    value={weaponName}
                    onChange={(e) => setWeaponName(e.target.value)}
                />
                <button onClick={fetchCharacterStat}>Отримати характеристику</button>
                {statResult && <div className="stat-result">{statResult}</div>}
            </div>
        </>
    );

    // Рендер таблиці персонажів
    const renderCharacters = () => (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Назва</th>
                    <th>Тип зброї</th>
                    <th>Елемент</th>
                    <th>HP</th>
                    <th>Кількість атак</th>
                    <th>ID зброї</th>
                    <th>ID артефакту</th>
                </tr>
            </thead>
            <tbody>
                {artifactData.map((item) => (
                    <tr key={item.character_id}>
                        <td>{item.character_id}</td>
                        <td>{item.name}</td>
                        <td>{item.weapon_type}</td>
                        <td>{item.element}</td>
                        <td>{item.hp}</td>
                        <td>{item.attack_count}</td>
                        <td>{item.weapon_id}</td>
                        <td>{item.artifact_id}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    // Рендер таблиці всіх характеристик персонажів
    const renderAllCharacterStats = () => (
        <table className="all-character-stats-table">
            <thead>
                <tr>
                    <th>Ім'я персонажа</th>
                    <th>Назва зброї</th>
                    <th>Збільшений параметр</th>
                    <th>Значення збільшення</th>
                    <th>Фінальна атака</th>
                    <th>Фінальне HP</th>
                </tr>
            </thead>
            <tbody>
                {allCharacterStats.map((stat, index) => (
                    <tr key={index}>
                        <td>{stat.CharacterName}</td>
                        <td>{stat.WeaponName}</td>
                        <td>{stat.ParameterIncreased}</td>
                        <td>{stat.IncrementValue}</td>
                        <td>{stat.FinalAttack}</td>
                        <td>{stat.FinalHP}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <div className="info-page">
            <div className="menu">
                <button onClick={() => setActiveTable(3)}>Персонажі</button>
                <button onClick={() => setActiveTable(2)}>Зброя</button>
                <button onClick={() => setActiveTable(1)}>Артефакти</button>
                <button onClick={() => setActiveTable(4)}>Усі</button>
            </div>
            <div className="screen">
                {activeTable === 1 && renderArtifacts()}
                {activeTable === 2 && renderWeapons()}
                {activeTable === 3 && renderCharacters()}
                {activeTable === 4 && renderAllCharacterStats()}
            </div>
        </div>
    );
}

export default Info;
