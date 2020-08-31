import * as fs from "fs";
import {JutsusBody,DebutInfo,DataInfo,info_jutsus} from '../src/interfaces'

async function get_jutsus_page(page:any):Promise<JutsusBody[]>{
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

async function next_page(page:any):Promise<boolean>{
    const data = await page.evaluate(()=>{
        let next_page: HTMLElement  = document.querySelector('a.category-page__pagination-next') as HTMLElement;
        if (next_page){
            //next_page.click()
            const url = next_page.getAttribute('href')
            return [true,url]
        }else{
            return [false]
        }
    })
    if (data[0]) await page_refresh(page,data[1]);
    console.log('data',data)
    return data[0]
}

async function page_refresh(page:any,url:string){
    try{
        await page.goto(url,{
            waitUntil: 'load'
        });
        return true;
    }catch(error){
        console.log(`error ${error}`)
        await page_refresh(page,url);
    }
}

async function generate_page_jutsu(jutsu:JutsusBody,url:string,browser:any){
    let page = await browser.newPage();
    await page_refresh(page,`${url}${jutsu.href}`);
    const info = await page.evaluate(()=>{
        let data: info_jutsus = {};
        let debut_info : DebutInfo = {};
        let data_info : DataInfo = {};
        const regex = new RegExp('<[^>]*>');
        const sections =  Array.from(document.querySelectorAll('section.pi-item.pi-group.pi-border-color'))
        for (const sec of sections){
            const h2 = sec.querySelector('h2.pi-item')
            const name =  (h2) ? h2.textContent : null
            if (name === 'Debut'){
                const debut = Array.from(document.querySelectorAll('div.pi-item.pi-data.pi-item-spacing.pi-border-color'))
                for (const deb of debut){
                    const h3 = deb.querySelector('h3.pi-data-label.pi-secondary-font')
                    const h3_content = (h3) ? h3.textContent : null
                    if (h3_content === 'Appears in'){
                        const content = deb.querySelector('div.pi-data-value.pi-font') 
                        debut_info['appears_in'] = (content) ? content.textContent : null 
                    }
                    if (h3_content === 'Manga'){
                        const content = deb.querySelector('div.pi-data-value.pi-font') 
                        debut_info['manga'] = (content) ? content.textContent : null 
                    }
                }
            }
            if (name === 'Data'){
                const data_naruto = Array.from(document.querySelectorAll('div.pi-item.pi-data.pi-item-spacing.pi-border-color'))
                for(const dn of data_naruto){
                    const h3 = dn.querySelector('h3.pi-data-label.pi-secondary-font')
                    const h3_content = (h3) ? h3.textContent: null
                    if (h3_content === 'Classification'){
                        const content = dn.querySelector('div.pi-data-value.pi-font') 
                        data_info['classification'] = (content) ? 
                        content.textContent ?content.textContent.replace(regex,' ') :null
                        : null 
                    }
                    if (h3_content === 'Nature'){
                        const content = dn.querySelector('div.pi-data-value.pi-font') 
                        data_info['nature'] = (content) ? 
                            content.textContent ? content.textContent.replace(regex,' ') :null 
                            : null 
                    }
                    if (h3_content === 'Class'){
                        const content = dn.querySelector('div.pi-data-value.pi-font') 
                        data_info['class'] = (content) ? content.textContent : null 
                    }
                    if (h3_content === 'Range'){
                        const content = dn.querySelector('div.pi-data-value.pi-font') 
                        data_info['range'] = (content) ? content.textContent : null 
                    }
                }
            }
        }
        data.data = data_info;
        data.debut = debut_info;
        return data
    })
    console.log(`===${jutsu.href}===`)
    info.name = jutsu.title;
    info.url = jutsu.href;
    if(info) console.log(info)
    await page.close();
    return info
}

function write_json(data: Array<info_jutsus>, num:number|string){
    fs.writeFile(`data/jutsus/jutsus${num}.json`, JSON.stringify(data,null,4), 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
}

export async function get_all_jutsus(browser_page:any,url:string,debug:boolean = false,attempts:number=1){
    let page = browser_page[1];
    let data_to_json: Array<info_jutsus> = []
    if(debug){
        let data: JutsusBody[] = await get_jutsus_page(page);
        console.log(data.slice(0,2));
        for (const item of data.slice(0,2)){
            let info = await generate_page_jutsu(item,url,browser_page[0])
            data_to_json = data_to_json.concat(info)
        }
        write_json(data_to_json,'example')
        let isnext: boolean = await next_page(page);
        console.log(isnext);
    }else{
        let data: JutsusBody[] = await get_jutsus_page(page);
        for (const item of data){
            let info = await generate_page_jutsu(item,url,browser_page[0]);
            data_to_json = data_to_json.concat(info);
        }
        write_json(data_to_json,attempts)
        attempts++;
        console.log(attempts)
        const isnext:boolean = await next_page(page);
        if (isnext) await get_all_jutsus(browser_page,url,false,attempts);
    }
    return 'Well Done' //🥑  
}