export async function page_refresh(page:any,url:string){
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