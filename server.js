var http = require('http');
var url = require('url');

var jugadores = [];

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  var q = url.parse(req.url, true).query;

  if(q.jugador){
    var jugador = JSON.parse(q.jugador);
    if(typeof jugador.nom === 'string' &&
       typeof jugador.pos === 'object' &&
       typeof jugador.pos.length === 'number' &&
       jugador.pos.length === 2 &&
       typeof jugador.tam === 'number'){
        var indice = -1;
        for(var i = 0; i < jugadores.length; i++){
          if(jugadores[i].nom === jugador.nom){
            indice = i;
            break;
          }
        }
        if(indice < 0){
          jugadores.push(jugador);
          res.end('Jugador Creado');
        } else {
          var otrosjugadores = [];
          jugadores[indice] = jugador;
          for(var i = 0; i < jugadores.length; i++){
            var dx = jugadores[i].pos[0] - jugador.pos[0];
            var dy = jugadores[i].pos[1] - jugador.pos[1];
            var d = Math.sqrt((dx*dx)+(dy*dy));
            var objetojugador = {nombre: jugadores[i].nom, Esta_a: d + " Unidades", mide: jugadores[i].tam};
            otrosjugadores.push(objetojugador);
          }
          res.end(JSON.stringify(otrosjugadores));
        }
    } else {
      res.end('incorrecto');
    }
  } else {
     res.end('Error');
  }
}).listen(process.env.PORT);
