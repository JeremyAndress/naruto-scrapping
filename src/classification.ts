import {page_refresh} from '../src/utils';
import {TitlesBody} from '../src/interfaces';

async function get_class_page(page:any):Promise<TitlesBody[]>{
    const data = await page.evaluate(() => { 
        const all_link = document.querySelectorAll('a.category-page__member-link')
        const all_link_l = Array.from(all_link)
        return all_link_l.map(link => {
            return {
                href:link.getAttribute('href'),
                title:link.textContent
            }
        });
    });
    return data || []
}

async function get_info_class(browser:any,url:string,classiff:TitlesBody){
    let page = await browser.newPage();
    await page_refresh(page,`${url}${classiff.href}`);
    const data = await page.evaluate(()=>{
        //data
    })
}

export async function get_all_class(browser_page:any,url:string){
    const page = browser_page[1];
    const all_class: Array<TitlesBody> = await get_class_page(page);
    for(const info of all_class){
        console.log(info)
        await get_info_class(browser_page[0],url,info)
    }
}