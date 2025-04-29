const champion = document.querySelector('#champion');
let isLoading = true;
const LANGUAGE = 'en_US';
const MAPS = {
    11: "Summoner's Rift"
}
const STATISTICS = {
    armor: "Armor",
    armorperlevel: "Armor Per Level",
    attackdamage: "Attack Damage",
    attackdamageperlevel: "Attack Damage Per Level",
    attackrange: "Attack Range",
    attackspeed: "Attack Speed",
    attackspeedperlevel: "Attack Speed Per Level",
    crit: "Critical",
    critperlevel: "Critical Per Level",
    hp: "Health Points",
    hpperlevel: "Health Points Per Level",
    hpregen: "Health Point Regeneration",
    hpregenperlevel: "Health Point Regeneration Per Level",
    movespeed: "Movement Speed",
    mp: "Mana Points",
    mpperlevel: "Mana Points Per Level",
    mpregen: "Mana Point Regeneration",
    mpregenperlevel: "Mana Point Regeneration Per Level",
    spellblock: "Spell Block",
    spellblockperlevel: "Spell Block Per Level"
};
const STATISTICS_TABLE = document.querySelector('#statistics');
const COOLDOWNS_TABLE = document.querySelector('#cooldowns');
const updateButton = document.querySelector('#update');
const versionsCount = document.querySelector('#versions');

const example = await x(3, champion.value);
isLoading = false;
updateButton.disabled = false;
updateCooldownsTable(example);
updateStatisticsTable(example);

updateButton.addEventListener('click', async event => {
    const count = parseInt(versionsCount.value);
    const data = await x(count, champion.value);
    if(!data) return;
    updateCooldownsTable(data);
    updateStatisticsTable(data);
});

async function getChampion(version, language, champion) {
    try {
        const URL = `https://ddragon.leagueoflegends.com/cdn/${version}/data/${language}/champion/${champion}.json`;
        const response = await fetch(URL);
        const data = await response.json();
        return data.data[champion];
    } catch (error) {
        console.log(error);
    }
}

async function getRecentVersions(count) {
    const response = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
    const versions = await response.json();
    if(count > 0) {
        return versions.slice(0, count);
    }
    return versions[0];
}

async function x(count = 0, champion = 'Shen', language = LANGUAGE) {
    if(!champion) {
        champion = 'Shen';
    }
    const y = [];
    const versions = await getRecentVersions(count);
    for(const version of versions) {
        const data = await getChampion(version, language, champion);
        y.push(data);
    }
    return y;
}

function createRow(spells) {
    const cells = [];
    const tr = document.createElement('tr');

    for(const spell of spells) {
        const td = document.createElement('td');
        td.textContent = spell.cooldown.toString();
        cells.push(td);
    }

    tr.append(...cells);

    return tr;
}

function createStatisticRow(statistics) {
    console.log(statistics)
    const cells = [];
    const row = document.createElement('tr');
    for(const statistic in statistics) {
        const cell = document.createElement('td');
        cell.textContent = statistics[statistic];
        cells.push(cell);
    }
    row.append(...cells);
    return row;
}

function updateCooldownsTable(data) {
    const rows = data.map(entry => createRow(entry.spells));
    COOLDOWNS_TABLE.caption.textContent = `${data[0].name}'s Cooldowns`;
    COOLDOWNS_TABLE.tBodies[0].replaceChildren(...rows);
}

function updateStatisticsTable(data) {
    const cells = Object.keys(data[0].stats).map(key => {
        const cell = document.createElement('th');
        cell.textContent = STATISTICS[key];
        return cell;
    });
    console.log(cells)
    const rows = data.map(entry => createStatisticRow(entry.stats));
    STATISTICS_TABLE.caption.textContent = `${data[0].name}'s Statistics`;
    STATISTICS_TABLE.tHead.rows[0].replaceChildren(...cells);
    STATISTICS_TABLE.tBodies[0].replaceChildren(...rows);
}