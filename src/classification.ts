import {page_refresh} from '../src/utils';
import {TitlesBody,ClassF} from '../src/interfaces';

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
        const div = document.querySelector('div.WikiaArticle')
        const info_list = (div) ? Array.from(div.querySelectorAll('p:not([class])')):[]
        let info_text = info_list.filter(word =>{
            const regexp = new RegExp('^Main article:');
            if (!regexp.test(word.textContent || 'Main article:')){
                return word
            }
        }).map(word => word.textContent)
        return info_text
    })
    return data
}

export async function get_all_class(browser_page:any,url:string){
    const page = browser_page[1];
    const all_class: Array<TitlesBody> = await get_class_page(page);
    for(const info of all_class){
        const data:ClassF =  {
            'href':info.href,
            'title':info.title, 
            'data':await get_info_class(browser_page[0],url,info)
        } 
        console.log(data)
        
    }
}