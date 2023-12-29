const fs = require('fs');

// Ваш JSON-объект
const jsonData = {
    "logs": [{
        "status": "success",
        "logs": [{
            "log": null,
            "site": "https://spielcasinosvergleichen.com"
        }, {
            "log": [{
                "href": "https://premiumcasinoworld.com/best-list?gclid=CjwKCAiA-P-rBhBEEiwAQEXhH7C3bOaE1Rrzx_Az8jyIqt4nSBmRlbEP1zOSEwmAAEEv6O_HQJjj8xoCYGAQAvD_BwE#casino-list",
                "text": "Casino Hotels"
            }],
            "site": "https://premiumcasinoworld.com"
        }, {
            "log": [{
                "href": "mailto:info@mobiles-casino-bayern.de",
                "text": "info@mobiles-casino-bayern.de"
            }, {
                "href": "https://mobiles-casino-bayern.de/",
                "text": "Start"
            }, {
                "href": "https://mobiles-casino-bayern.de/ueber-uns",
                "text": "Über uns"
            }, {
                "href": "https://mobiles-casino-bayern.de/die-spieltische-2",
                "text": "Die Spieltische"
            }, {
                "href": "https://mobiles-casino-bayern.de/313-2",
                "text": "Eventideen"
            }],
            "site": "https://mobiles-casino-bayern.de"
        }, {
            "log": [{
                "href": "https://www.loewen-play.de/#",
                "text": "Cookiebot2"
            }, {
                "href": "https://www.loewen-play.de/#",
                "text": "Google3"
            }, {
                "href": "https://www.loewen-play.de/#",
                "text": "LiveChat2"
            }, {
                "href": "https://www.loewen-play.de/#",
                "text": "www.loewen-play.de2"
            }, {
                "href": "https://www.loewen-play.de/#",
                "text": "LiveChat1"
            }],
            "site": "https://www.loewen-play.de"
        }],
        "brandClick": 11,
        "sites": 4
    }],
    "brandClick": 11,
    "sites": 4
}

const processLogs = logs => {
    if (!logs || !Array.isArray(logs)) {
        return '';
    }

    const logData = logs.flatMap(log => {
        const site = log.site || '';
        const logEntries = log.log || [];
        return logEntries.map(entry => {
            const logHref = entry.href || '';
            const logText = entry.text || '';
            const status = log.status || '';
            const brandClick = log.brandClick || '';
            const sites = log.sites || '';
            return `"${site}","${logHref}","${logText}","${status}","${brandClick}","${sites}"`;
        });
    });

    return logData.join('\n');
};

// Формируем строку CSV для каждого элемента
const csvRows = jsonData.logs.flatMap(log => {
    const topLevelSite = log.site || '';
    const topLevelStatus = log.status || '';
    const topLevelBrandClick = log.brandClick || '';
    const topLevelSites = log.sites || '';

    const nestedLogs = processLogs(log.logs);

    return [
        `"${topLevelSite}","","","${topLevelStatus}","${topLevelBrandClick}","${topLevelSites}"`,
        nestedLogs
    ];
});

// Формируем заголовок CSV
const csvHeader = 'Site,Log Href,Log Text,Status,Brand Click,Sites\n';

try {
    const csvData = csvHeader + csvRows.join('\n');
    fs.writeFileSync('output.csv', csvData); // Запись в файл output.csv
    console.log('CSV файл успешно создан');
} catch (err) {
    console.error(err);
}