import moment from 'moment';
import {generate_launch} from '../src/generate_launch';
moment.locale('es');

(async ()=>{
    const hoy = moment();
    console.log(hoy.format('dddd Do MMMM YYYY'));
    const url = 'https://naruto.fandom.com/wiki/Category:Jutsu';
    const gen = await generate_launch(url);
    await gen[0].close();
})();