import moment from 'moment';
import {generate_launch} from '../src/generate_launch';
import {get_all_jutsus} from '../src/jutsus';
import {get_all_class} from '../src/classification';
import {get_all_char} from '../src/characters';
moment.locale('es');

(async ()=>{
    const hoy = moment();
    console.log(hoy.format('dddd Do MMMM YYYY'));
    const url = 'https://naruto.fandom.com';
    // jutsus ♠ 
    // const gen_jutsus = await generate_launch(url,'/wiki/Category:Jutsu');
    //const jutsus = await get_all_jutsus(gen_jutsus,url,false,1);
    //await gen_jutsus[0].close();
    //classification 🦋 
    // const gen_class = await generate_launch(url,'/wiki/Category:Jutsu_Type');
    // const classification = await get_all_class(gen_class,url)
    //characters 🎡 
    const gen_charac = await generate_launch(url,'/wiki/Category:Characters');
    const characters = await get_all_char(gen_charac,url)

})();