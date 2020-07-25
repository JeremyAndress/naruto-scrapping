import moment from 'moment';
import {launch} from 'puppeteer';

moment.locale('es');
const hoy = moment();
console.log(hoy.format('dddd Do MMMM YYYY'));

(async () => {
    const browser = await launch({headless: false});
    const page = await browser.newPage();
    await page.setViewport({
        width: 1519,
        height: 7162,
        deviceScaleFactor: 1,
    });
    await page.goto('https://naruto.fandom.com/wiki/Category:Characters');
    await page.screenshot({path: 'google.png'});
    await browser.close();
})();