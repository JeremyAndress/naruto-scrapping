
export async function get_all_justus(page:any){
    // const data = await page.evaluate(() => { 
    //     const category = document.querySelector("#mw-content-text > div.category-page__members");
    //     if (category){
    //         // return category.textContent
    //         const jutsus = Array.from(category.querySelectorAll('ul.category-page__members-for-char'));
    //         return jutsus
    //     }else{
    //         return {}
    //     }
    // });
    const data = await page.evaluate(() => { 
        const all_link = document.querySelectorAll('a.category-page__member-link')
        const all_link_l = Array.from(all_link)
        //return all_link_l.map(link => link.textContent);
        return all_link_l.map(link => {
            return {
                href:link.getAttribute('href'),
                title:link.textContent
            }
        });
    });
    console.log(data);
}