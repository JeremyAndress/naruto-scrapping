interface JutsusBody { href: string; title: string }

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
    if (data[0]) await page.goto(data[1]);
    console.log('data',data)
    return data[0]
}

async function get_all_info(jutsu:JutsusBody){
    console.log(jutsu);
}

export async function get_all_jutsus(page:any,debug:boolean = false){
    if(debug){
        let data: JutsusBody[] = await get_jutsus_page(page);
        console.log(data.slice(0,10));
        let isnext: boolean = await next_page(page);
        console.log(isnext);
        data.forEach(item =>{
            get_all_info(item)
        });
    }else{
        let data: JutsusBody[] = [];
        let jutsus_page: JutsusBody[] = await get_jutsus_page(page);
        data = data.concat(jutsus_page);
        console.log(data.slice(0,10));
        const isnext:boolean = await next_page(page);
        if (isnext) await get_all_jutsus(page);
    }
    return 'Well Done' //🥑  
}