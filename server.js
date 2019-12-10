var http = require('http');
var url = require('url');

var jugadores = [];
var bolitas = [];
var tam_tablero = [
    800*100,
    800*100
];
// generar bolitas aleatorias
for (var i = 0; i < 20*50; i++) {
    var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    bolitas.push({
        "tam": 1,
        "pos": [
            Math.floor(Math.random() * tam_tablero[0]),
            Math.floor(Math.random() * tam_tablero[1])
        ],
        "col": randomColor
    });
}

function respuesta_jugadores(res, jugador) {
    var temp = [];
    for (var i = 0; i < jugadores.length; i++) {
        var dx = jugadores[i].pos[0] - jugador.pos[0];
        var dy = jugadores[i].pos[1] - jugador.pos[1];
        var d = Math.sqrt((dx * dx) + (dy * dy));
        var objetojugador = {
            nom: jugadores[i].nom,
            dis: d,
            pos: jugadores[i].pos,
            tam: jugadores[i].tam,
            col: jugadores[i].col
        };
        temp.push(objetojugador);
    }
    res.end(JSON.stringify([temp, bolitas]));
}

function crear_o_actualizar_jugador(jugador, res) {
    // revisar que el jugador tenga todo lo necesario
    if (typeof jugador.nom === 'string' &&
            typeof jugador.pos === 'object' &&
            typeof jugador.pos.length === 'number' &&
            jugador.pos.length === 2 &&
            typeof jugador.pos[0] === 'number' &&
            typeof jugador.pos[1] === 'number' &&
            typeof jugador.tam === 'number' &&
            typeof jugador.col === 'string') {
        // revisar si el jugador ya existe
        var indice = -1;
        for (var i = 0; i < jugadores.length; i++) {
            if (jugadores[i].nom === jugador.nom) {
                indice = i;
                break;
            }
        }
        // si el jugador no existe, crearlo
        if (indice < 0) {
            jugadores.push(jugador);
            respuesta_jugadores(res, jugador);
        } else {
            // actualizar jugador
            jugadores[indice] = jugador;
            respuesta_jugadores(res, jugador);
        }
    } else {
        res.end('405');
    }
}

http.createServer(function (req, res) {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Request-Method','*');
    res.setHeader('Access-Control-Allow-Methods','OPTIONS,GET');
    res.setHeader('Access-Control-Allow-Headers','*');
    res.writeHead(200, {'Content-Type': 'application/json'});
    var q = url.parse(req.url, true).query;
    if (q.jugador) {
        var jugador = JSON.parse(q.jugador);
        crear_o_actualizar_jugador(jugador, res);
    } else if(q.eliminar){
        var indice = JSON.parse(q.eliminar);
        bolitas[indice].pos =[
            Math.floor(Math.random() * tam_tablero[0]),
            Math.floor(Math.random() * tam_tablero[1])
        ];
        res.end("1000");
    } else if(q.eliminarJugador){
        var jugadoresEliminar = JSON.parse(q.eliminarJugador);
        var existen = 0;
        var indice = [];
       for(var i = 0; i < jugadores.length; i++)
       {
           if(jugadores[i].nom === jugadoresEliminar[0] || jugadores[i].nom === jugadoresEliminar[1])
           {
               existen++;
               indice.push(i);
           }
       }
       
       if(existen === 2)
       {
           var temp = [];
           if(jugadores[indice[0]].tam >  jugadores[indice[1]].tam)
           {
               for(var i = 0; i < jugadores.length; i++)
               {
                   if(i !== indice[1]) temp.push(jugadores[i]);
               }
           } else if(jugadores[indice[1]].tam >  jugadores[indice[0]].tam)
           {
               for(var i = 0; i < jugadores.length; i++)
               {
                   if(i !== indice[0]) temp.push(jugadores[i]);
               }
           }
           if(temp.length > 0) jugadores = temp;
       }
               res.end("1001");

    } else {
        res.end('404');
    }
}).listen(process.env.PORT);
