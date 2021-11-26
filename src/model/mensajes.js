const Contenedor = require('../lib/contenedorDB.js')
const conn = require('../lib/connections.js')

class Mensajes extends Contenedor{
    constructor(){
        super(conn.sqlite,'mensajes')
    }
}

module.exports = Mensajes