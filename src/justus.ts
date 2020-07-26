
export async function get_all_justus(page:any){
    const data = await page.evaluate(() => { 
        const category = document.querySelector("#mw-content-text > div.category-page__members");
        if (category){
            // return category.textContent
            const jutsus = Array.from(category.querySelectorAll('ul.category-page__members-for-char'));
            return jutsus
        }else{
            return {}
        }
    });
    console.log(data);
}