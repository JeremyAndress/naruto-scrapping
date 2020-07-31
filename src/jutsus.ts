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

async function generate_page_jutsu(jutsu:JutsusBody,url:string,browser:any){
    console.log(jutsu);
    if(jutsu.title === 'Accelerated Armed Revolving Heaven'){
        let page = await browser.newPage();
        await page.goto(`${url}${jutsu.href}`);
        const title = await page.evaluate(()=>{
            const title:HTMLElement = document.querySelector('div.pi-data-value') as HTMLElement;
            //const title:HTMLElement = document.querySelector('h1.page-header__title') as HTMLElement;
            if(title){
                return title.textContent
            }else{
                return null
            }
        })
        if(title) console.log(title)
        //await page.close();

    }
    // const page = await browser.newPage();
    // await page.goto(`${url}${jutsu.href}`);
    // console.log('abierta');
    // await page.close();
}

export async function get_all_jutsus(browser_page:any,url:string,debug:boolean = false){
    let page = browser_page[1];
    if(debug){
        let data: JutsusBody[] = await get_jutsus_page(page);
        console.log(data.slice(0,10));
        // data.forEach(item =>{
        //     generate_page_jutsu(item,url,browser_page[0])
        // });
        for (const item of data){
            await generate_page_jutsu(item,url,browser_page[0])
        }
        let isnext: boolean = await next_page(page);
        console.log(isnext);
    }else{
        let data: JutsusBody[] = [];
        let jutsus_page: JutsusBody[] = await get_jutsus_page(page);
        data = data.concat(jutsus_page);
        console.log(data.slice(0,10));
        const isnext:boolean = await next_page(page);
        if (isnext) await get_all_jutsus(page,url);
    }
    return 'Well Done' //🥑  
}