const champion = document.querySelector('#champion');
const LANGUAGE = 'en_US';
const MAPS = {
    11: "Summoner's Rift"
}
const TBODY = document.querySelector('#champion tbody');
const updateButton = document.querySelector('#update');
const versionsCount = document.querySelector('#versions');
const example = await x(3, champion.value);
const rows = example.map(entry => createRow(entry.spells));

TBODY.replaceChildren(...rows);

updateButton.addEventListener('click', async event => {
    const count = parseInt(versionsCount.value);
    const data = await x(count, champion.value);
    console.log(count, data)
    if(!data) return;
    const rows = data.map(entry => createRow(entry.spells));
    TBODY.replaceChildren(...rows);
})

console.log(example, rows);

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