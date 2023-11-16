const puppeteer = require('puppeteer-extra');
const pluginProxy = require('puppeteer-extra-plugin-proxy');
const fs = require('fs');
const searchPage = require('./utils/searchPage');
USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36';
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const account = require('./models/accountModel');
puppeteer.use(StealthPlugin());
puppeteer.use(require('puppeteer-extra-plugin-session').default());

module.exports = async (userOptions) => {

    puppeteer.use(pluginProxy({
        address: userOptions.proxy_host,
        port: userOptions.proxy_port,
        credentials: {
            username: userOptions.proxy_username,
            password: userOptions.proxy_password,
        }
    }));

    const browser = await puppeteer.launch({
        headless: true,
        executablePath: process.env.path,

    });
    const page = await browser.newPage();
    try {
        if (!userOptions.session) throw new Error("Not authorized");
        let sessionData = JSON.parse(userOptions.session);
        await page.goto('https://google.com');
        await page.session.restore(sessionData);

        await page.goto('https://accounts.google.com');


        const hasOVnw0d = await page.$('.OVnw0d');

        if (hasOVnw0d) {
            await page.click('ul.OVnw0d li:first-child');
            const hasOVnw0d = await page.$eval('.OVnw0d', (element) => element !== null);
            try {
                await page.waitForSelector('input[type="password"]', {
                    timeout: 60000,
                    visible: true
                });
                await page.type('input[type="password"]', userOptions.password);
                await page.keyboard.press('Enter');
                await page.waitForNavigation({
                    waitUntil: 'domcontentloaded'
                });

                const currentUrl = page.url();

                if (currentUrl.includes('myaccount.google.com')) {

                    const keywords = userOptions.keywords.split(',');
                    const logs = [];
                    for (keyword of keywords) {
                        // console.log(keyword)
                        if (keyword.length<1)continue
                        const r = await searchPage(browser, page, keyword, userOptions.stop_words)
                        logs.push(r)
                    }
                    console.log("Logggggs",logs)
                    console.log("Logggggs",logs.length)
                    if (logs.length > 0) {
                        const result = {
                            logs,
                            brandClick: 0,
                            sites: 0
                        };

                        console.log("logs1:",result)

                        
                        result.brandClick = logs.reduce((sum, entry) => sum + (entry.brandClick || 0), 0);
                        result.sites = logs.reduce((sum, entry) => sum + (entry.sites || 0), 0);
                        console.log("logs:",result)
                        await account.updateLogs(userOptions.id, result)
                    }
                } else {
                    await account.updateAuthStatus(userOptions.id,false)
                }

            } catch (e) {
                console.log('Ничего не получилось c авторизацией',e);
            }
        } else {
            
            // await page.waitForNavigation({
            //     waitUntil: 'domcontentloaded'
            // });
            const currentUrl = page.url();

            if (currentUrl.includes('myaccount.google.com')) {
                await new Promise(resolve => setTimeout(resolve, 3000)); // 1 секунда
                const keywords = userOptions.keywords.split(',');
                // console.log(keywords)
                const logs = [];
                for (keyword of keywords) {
                    if (keyword.length<1)continue
                    const r = await searchPage(browser, page, keyword, userOptions.stop_words)
                    logs.push(r)
                }
                console.log("Logggggs2",logs)
                console.log("Logggggs2",logs.length)
                if (logs.length > 0) {
                    let result = {
                        logs,
                        brandClick: 0,
                        sites: 0
                    };

                    result.brandClick = logs.reduce((sum, entry) => sum + (entry.brandClick || 0), 0);
                    result.sites = logs.reduce((sum, entry) => sum + (entry.sites || 0), 0);
                    console.log("logs:",result)
                    await account.updateLogs(userOptions.id, result)
                }
            } else {
                await account.updateAuthStatus(userOptions.id,false)
                console.log('Ошибка: Неверный URL после авторизации');
            }

        }

        console.log('начало')
        await new Promise(resolve => setTimeout(resolve, 3000)); // 1 секунда
        // if (!page.isClosed()) {
        let session = await page.session.dump(); // or page.session.dumpString()
        await account.updateSession(userOptions.id, session);
        
        //   const sessionData = await page.session.dump(); // or page.session.dumpString()

        //   const cookies = await page.cookies();
        //   fs.writeFileSync('cookies.json', JSON.stringify(sessionData, null, 2));
        //   console.log(sessionData)
        //   const session = await page.createSession('mySession');
        //   await session.saveSession('session.json');

        //   await browser.close();
    } catch (e) {
        console.log('Warning:', e)

    } finally {
        // }
        // fs.writeFileSync('cookies.json', JSON.stringify(sessionData, null, 2));
        // console.log(sessionData)
        browser.close()
    }

};