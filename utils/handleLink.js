const handleLink = async (browser,page, linkElement) => {
    const link = await page.evaluate(linkElement => linkElement.href, linkElement);
    const text = await page.evaluate(linkElement => linkElement.textContent, linkElement);
  
    console.log(`Ссылка: ${link}, Текст: ${text}`);
    await page.click('a.sVXRqc', { button: 'middle' }); // Клик средней кнопкой мыши для открытия в новой вкладке

    // Открываем новую вкладку в текущем браузере
    const pages = await browser.pages();
    const newPage = pages[pages.length - 1];

    await newPage.bringToFront();
    await newPage.waitForNavigation({ waitUntil: 'domcontentloaded' }); // Дождитесь загрузки содержимого новой страницы

    

    // Ваш код для выполнения действий на новой вкладке
    await newPage.goto(link);
  
    // Закрываем новую вкладку
    await newPage.close();
  };
module.exports = handleLink;