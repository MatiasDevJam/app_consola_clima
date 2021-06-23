require('dotenv').config();

const {leerInput, inquirerMenu, pausa, listarLugares} = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');

const main = async() =>{

    const busquedas = new Busquedas();
    //Con el do-while creamos un ciclo infinito para mostrar el menú
    //En caso de selecionar la opción 0 la aplicación finaliza.
    let opt;

    do{
        opt = await inquirerMenu();
        
        switch (opt) {
            case 1:
                //Mostramos el mensaje en consola
                const entrada = await leerInput('Ciudad: ');

                //Buscamos los lugares
                const lugares = await busquedas.ciudad(entrada);

                //Seleccionamos el lugar
                const id = await listarLugares(lugares);
                if(id === '0') continue;
                //Buscamos el lugar el lugar por ID para que nos traiga los datos
                const lugarSel = lugares.find( l => l.id === id);

                //Guardamos en DB
                busquedas.agregarHistorial(lugarSel.nombre);

                //CLima - Le pasamos como argumentos
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);


                //Mostramos los resultados
                console.clear();
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad:', lugarSel.nombre.green);
                console.log('Lat:', lugarSel.lat);
                console.log('Lng:', lugarSel.lng);
                console.log('Temperatura:', clima.temp);
                console.log('Mínima:', clima.min);
                console.log('Máxima:', clima.max);
                console.log('Como está el clima:', clima.desc.green);
                    
            break;

            case 2:
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx} ${lugar}`);
                });
            break;
        
        }
        
        if(opt !==0 ) await pausa();
    }while(opt !==0)
}


main();