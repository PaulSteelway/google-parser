const handleLinkInNewTab = require('./browserLink');
const fs = require('fs');

module.exports = async function searchPage(browser, page, search, stoplist = null) {
    let result;
    try {
        await page.goto('https://google.com', { waitUntil: 'domcontentloaded' });



        
        let isModalVisible = await page.evaluate(() => {
            const modal = document.getElementById('xe7COe');
            return modal !== null && window.getComputedStyle(modal).display !== 'none';
        });
        if (isModalVisible) {
            await page.click('#L2AGLb');
        }

        await page.waitForSelector('textarea');

        await page.type('textarea', search);

        await page.keyboard.press('Enter');
        await new Promise(resolve => setTimeout(resolve, 4000)); // 1 секунда

        
        await new Promise(resolve => setTimeout(resolve, 4000)); // 1 секунда

        isModalVisible = await page.evaluate(() => {
            const modal = document.getElementById('xe7COe');
            return modal !== null && window.getComputedStyle(modal).display !== 'none';
        });
        if (isModalVisible) {
            await page.click('#L2AGLb');
        }

       
        await page.waitForSelector('#tads');
        const tadsElement = await page.$('#tads');

        if (tadsElement) {}
        const uEierdElements = await tadsElement.$$('.uEierd');
        const linksArray = [];

        for (const uEierdElement of uEierdElements) {
            const linkElement = await uEierdElement.$('a.sVXRqc');
            if (linkElement) {
                const href = await linkElement.evaluate(link => link.href);

                if (stoplist && stoplist.length > 0) {
                    const {
                        hostname
                    } = new URL(href);

                    const isDomainBlocked = stoplist.some(domain => domain === hostname);
                    console.log(stoplist, hostname)
                    if (isDomainBlocked) {
                        console.log("Stop domain", hostname);
                        continue;
                    }

                }

                const text = await linkElement.evaluate(link => link.textContent.trim());
                linksArray.push({
                    href,
                    text
                });
            }
        }

        const logs = [];
        if (linksArray.length > 0) {
            console.log(linksArray)
            for (const element of linksArray) {
                const newPage = await browser.newPage();

                const result = await handleLinkInNewTab(newPage, element);
                console.log('boroda');
                logs.push(result)
                newPage.close();
            }
        }
        const totalLogsCount = logs.reduce((count, entry) => {
            if (entry && entry.log && Array.isArray(entry.log)) {
              return count + entry.log.length;
            }
            return count;
          }, 0);
        result = {
            status:"success",
            logs,
            brandClick:totalLogsCount,
            sites:logs.length
        }
        console.log(logs);
        return result;
    } catch (e) {
        console.log(e)
        result = {
            status:"error",
            logs:`${e}`
        }
        return result
    }

 
}