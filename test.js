const puppeteer = require('puppeteer-extra');
const pluginProxy = require('puppeteer-extra-plugin-proxy');
const fs = require('fs');
const searchPage = require('./utils/searchPage');
USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36';
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const account = require('./models/accountModel');
puppeteer.use(StealthPlugin());
puppeteer.use(require('puppeteer-extra-plugin-session').default());

module.exports =  async (userOptions) => {
    try{

        puppeteer.use(pluginProxy({
            address: userOptions.proxy_host,
            port: userOptions.proxy_port,
            credentials: {
                username: userOptions.proxy_username,
                password: userOptions.proxy_password,
            }
        }));
        const browser = await puppeteer.launch({
            headless: "new",
            executablePath: process.env.path,
    
        });
    
        const page = await browser.newPage();
        await page.setUserAgent(USER_AGENT);
        try{
            await page.goto('https://accounts.google.com');
    
            await page.waitForSelector('input[type="email"]', {
                timeout: 60000,
                visible: true
            });
            await page.type('input[type="email"]', userOptions.username);
            await page.keyboard.press('Enter');
        
            await page.screenshot({
                path: 'screenshot1.png'
            });
        
            //   await page.waitForSelector('div[id="identifierNext"]')
            //   await page.click('div[id="identifierNext"]');
        
            await page.waitForSelector('input[type="password"]', {
                timeout: 60000,
                visible: true
            });
            await page.type('input[type="password"]', userOptions.password);
            await page.keyboard.press('Enter');
        
        
            await page.screenshot({
                path: 'screenshot2.png'
            });
            try {
                await page.waitForSelector('ul.OVnw0d', {
                    timeout: 60000,
                    visible: true
                });
                await new Promise(resolve => setTimeout(resolve, 4000)); // 1 секунда
                const verifyElements = await page.$$('ul.OVnw0d');
                if (verifyElements.length > 0) {
                    const firstVerifyElement = await page.$('svg path[d="M4,6h18V4H4C2.9,4,2,4.9,2,6v11H0v3h14v-3H4V6z M23,8h-6c-0.55,0-1,0.45-1,1v10c0,0.55,0.45,1,1,1h6c0.55,0,1-0.45,1-1V9 C24,8.45,23.55,8,23,8z M22,17h-4v-7h4V17z"]');
    
                    // const firstVerifyElement = await page.$(':nth-child(3)');
                    await page.screenshot({
                        path: 'screenshot3.png'
                    });
                    if (firstVerifyElement) {
                        await firstVerifyElement.click();
                        await new Promise(resolve => setTimeout(resolve, 4000)); // 1 секунда
                        await new Promise(resolve => setTimeout(resolve, 40000)); // 40 секунда
    
                        // const smsCode = await promptForInput(); // Реализуйте эту функцию для получения ввода из консоли
                        
                    }
                }
            } catch (error) {
                console.log('авторизация без верификации')
            }
    
            await page.screenshot({
                path: 'screenshot4.png'
            });
            await new Promise(resolve => setTimeout(resolve, 3000)); // 1 секунда
        
            //   const cookies = await page.cookies();
            
            const keywords = userOptions.keywords.split(',');
            // console.log(keywords)
            for (keyword of keywords){
                // console.log(keyword)
                await searchPage(browser,page,keyword, userOptions.stop_words)
            }
            await account.updateAuthStatus(userOptions.id,true)
            let sessionData = await page.session.dump(); // or page.session.dumpString()
            await account.updateSession(userOptions.id,sessionData);
        }
        catch(e){
            console.log('Warning with browser:',e)
        }
        finally{
           
            // fs.writeFileSync('cookies.json', JSON.stringify(sessionData, null, 2));
            // console.log(sessionData)
            browser.close()
        }
    }
    catch(e){
        console.log('error with browser')
    }
    
}
// 
// parser(userOptions);
