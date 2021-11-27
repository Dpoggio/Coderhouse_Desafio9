
const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const handlebars = require('express-handlebars')
const { normalize, schema } = require("normalizr");


/**** CONSTANTES ****/
const PORT = process.env.PORT || 8080
const ERROR_CODE = 500

/*** Misc ****/
const Productos = require(__dirname + '/model/productoDaoMongo.js')
const Mensajes = require(__dirname + '/model/mensajes.js')
const productos = new Productos()
const mensajes = new Mensajes()

const { routerProductos } = require(__dirname + '/routers/routerProductos.js')
const { routerProductosTest } = require(__dirname + '/routers/routerProductosTest.js')


/**** Inicio App ****/
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

// Normalizr
const authorSchema = new schema.Entity('author', {}, { idAttribute: 'mail' });
const mensajesSchema = new schema.Entity('mensajes', {
    mensajes: [ { author: authorSchema } ]
});


async function getMensajes(){
    const listaMensajes = await mensajes.getAll()
    const mensajesDenorm = {id: 'mensajes', mensajes: listaMensajes}
    const mensajesNorm = normalize(mensajesDenorm, mensajesSchema);
    return mensajesNorm
}

// Configuracion WebSocket
io.on('connection', async socket => {
    console.log('Nuevo cliente conectado')

    socket.emit('actualizarProductos', await productos.getAll())
    socket.emit('actualizarMensajes', await getMensajes())

    socket.on('nuevoProducto', async producto => {
        await productos.save(producto)
        io.sockets.emit('actualizarProductos', await productos.getAll())
    })

    socket.on('nuevoMensaje', async mensaje => {
        await mensajes.save(mensaje)
        io.sockets.emit('actualizarMensajes', await getMensajes())
    })
})

// Configuracion Vista
app.engine('hbs', 
    handlebars({
        extname: '.hbs',
        defaultLayout: 'default.hbs',
        layoutsDir: __dirname + '/views/layouts',
        partialsDir: __dirname + '/views/partials'
    })
)
app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')


// Middleware incio
app.use(express.json())
app.use('/', express.static(__dirname + '/public'))
app.use(express.urlencoded({extended: true}))

// Routers
app.get('/', (req, res) => {
    res.render('main')
})

app.get('/productos-test', (req, res) => {
    res.render('productos-test')
})

app.use('/api/productos', routerProductos)
app.use('/api/productos-test', routerProductosTest)

// Middleware Errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    const { httpStatusCode = ERROR_CODE } = err
    res.status(httpStatusCode).json({
        error: err.message
    });
})

// Inicio server
const server = httpServer.listen(PORT, () => {
    console.log(`Servidor HTTP escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.error(`Error en servidor ${error}`))