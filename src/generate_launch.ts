import {launch} from 'puppeteer';

async function get_dimensions(page: any){
    const dimensions = await page.evaluate(() => {
        return {
            width: Math.max(
                document.body.scrollWidth,
                document.documentElement.scrollWidth,
                document.body.offsetWidth,
                document.documentElement.offsetWidth,
                document.documentElement.clientWidth
            ),
            height: Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.offsetHeight,
                document.documentElement.clientHeight
            ),
            deviceScaleFactor: 1 //window.devicePixelRatio
        };
    });
    return dimensions
}

export async function generate_launch(url:string){
    const browser = await launch({headless: false});
    const page = await browser.newPage();
    await page.goto(url);
    const dimensions = await get_dimensions(page)
    console.log(dimensions);
    await page.setViewport(dimensions);
    console.log('Dimensions:', dimensions);
    //await page.screenshot({path: 'google.png'});
    return [browser,page];
}

