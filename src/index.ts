import moment from 'moment';
import {generate_launch} from '../src/generate_launch';
import {get_all_jutsus} from '../src/jutsus';
moment.locale('es');

(async ()=>{
    const hoy = moment();
    console.log(hoy.format('dddd Do MMMM YYYY'));
    const url = 'https://naruto.fandom.com/wiki/Category:Jutsu';
    const gen = await generate_launch(url);
    const prueba = await get_all_jutsus(gen[1]);
    //await next_page(gen[1]);
    //await gen[0].close();
})();