import * as fs from "fs";
import {page_refresh} from '../src/utils';
import {TitlesBody,CharacterTable} from '../src/interfaces';


async function get_info_charac(browser:any,url:string,classiff:TitlesBody){
    let page = await browser.newPage();
    await page_refresh(page,`${url}${classiff.href}`);
    const data = await page.evaluate(()=>{
        const collapse = Array.from(document.querySelectorAll('span.mw-collapsible-toggle.mw-collapsible-toggle-collapsed'))
        let table_character:CharacterTable = {}
        for (const coll  of collapse){
            (coll as HTMLElement).click()
        }
        //tables data
        const table = Array.from(document.querySelectorAll('table.box.cellbox.mw-collapsible.mw-made-collapsible'))
        for (const tab of table){
            const title_table = tab.querySelector('th')?.textContent 
            if(title_table?.includes('Family')){
                const titles_li = Array.from(tab.querySelectorAll('li'))

                table_character.family = titles_li.map(ti =>ti ? ti.textContent: null)
            }
            // if(title_table?.includes('Nature Type')){

            // }
            // if(title_table?.includes('Jutsu')){

            // }
            // if(title_table?.includes('Tools')){

            // }
        }
        return table_character
    })
    console.log(data)
    return data
}



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


function write_json(data: Array<string>){
    fs.writeFile(`data/classification/classification.json`, JSON.stringify(data,null,4), 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
}

export async function get_all_char(browser_page:any,url:string){
    const page = browser_page[1];
    const all_class: Array<TitlesBody> = await get_class_page(page);
    for (const all of all_class){
        console.log(all)
        const char_data = await get_info_charac(browser_page[0],url,all)
    }
}