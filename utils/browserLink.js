module.exports = async function processPage(page, handleLink) {
    try{
        await page.goto(handleLink.href);
        const currentUrl = await page.url();
        console.log(currentUrl);
        const url = new URL(currentUrl);
        const baseUrl = `${url.protocol}//${url.hostname}`;
        const siblingLinks = await page.$$eval('a', links => {
            const linksArray = [];
    
            const groupedLinks = links.reduce((acc, link) => {
                const classes = Array.from(link.classList);
    
                const key = classes.join(' ');
    
                if (!acc.has(key)) {
                    acc.set(key, []);
                }
    
                acc.get(key).push(link);
                return acc;
            }, new Map());
    
            for (const [key, links] of groupedLinks) {
                const nonEmptyLinks = links.filter(link => link.textContent.trim() !== '');
                if (nonEmptyLinks.length > 0) {
                    const hrefAndTextArray = nonEmptyLinks.map(linkElement => {
                        const href = linkElement.href;
                        const text = linkElement.textContent.trim();
                        return {
                            href,
                            text
                        };
                    });
    
                    linksArray.push(hrefAndTextArray);
                }
            }
    
            return linksArray;
        });
    
        const keywords = ['casino', 'game', 'slot','play', 'bet'];
        const filteredLinks = filterLinksByKeywords(siblingLinks, keywords, baseUrl);
        const logLink = filteredLinks[0];
    
        if (logLink) {
            if (logLink.length > 5) {
                console.log({
                    log: logLink.slice(0, 5),
                    site: baseUrl
                });
                return {
                    log: logLink.slice(0, 5),
                    site: baseUrl
                };
            } else if (logLink.length > 0) {
                console.log({
                    log: logLink,
                    site: baseUrl
                });
                return {
                    log: logLink,
                    site: baseUrl
                };
            }
        }
        console.log({
            log: null,
            site: baseUrl
        });
        return {
            log: null,
            site: baseUrl
        };
    }
    catch(e){
        const currentUrl = await page.url();
        console.log(currentUrl);
        const url = new URL(currentUrl);
        const baseUrl = `${url.protocol}//${url.hostname}`;
        
        console.log('Warning:', e)
        return {
            log:null,
            site:baseUrl
        }
    }
}
    

async function isModalVisible(page, modalSelector) {
    const modal = await page.$(modalSelector);
    if (modal) {
        const isVisibleHandle = await modal.evaluateHandle(modal => {
            const style = window.getComputedStyle(modal);
            return style && style.display !== 'none' && style.visibility !== 'hidden';
        });
        const isVisible = await isVisibleHandle.jsonValue();
        await isVisibleHandle.dispose();
        return isVisible;
    } else {
        return false; 
    }
}

const filterLinksByKeywords = (linksArray, keywords, baseUrl) => {
    return linksArray.filter(linkGroup => {
        for (const linkObject of linkGroup) {
            const keywordRegex = new RegExp(keywords.join('|'), 'i');

            if(!linkObject.href)return false;
            const relativeHref = absoluteToRelative(baseUrl, linkObject.href);

            if (keywordRegex.test(linkObject.text) || keywordRegex.test(relativeHref)) {
                return true;
            }
        }

        return false;
    });
};

const absoluteToRelative = (baseUrl, absoluteUrl) => {
    const absolute = new URL(absoluteUrl);
    const base = new URL(baseUrl);

    if (absolute.origin !== base.origin) {
        return absolute.href;
    }

    const relativePath = absolute.pathname.replace(base.pathname, '');
    const relativeUrl = relativePath + absolute.search + absolute.hash;
    return relativeUrl;
};