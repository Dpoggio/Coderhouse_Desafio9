Handlebars.registerHelper('formatDate', function(date) {
    return new Handlebars.SafeString(
        new Date(date).toLocaleString()
    );
});

async function cargarMensajes(mensajes) {
    const plantilla = await obtenerPlantillaMensajes()
    const render = Handlebars.compile(plantilla);
    const html = render({ mensajes })
    document.getElementById('mensajes').innerHTML = html
    const scrollHeight = document.getElementById("mensajes").scrollHeight
    document.getElementById("mensajes").scrollTop = scrollHeight
}

function obtenerPlantillaMensajes() {
    return fetch('/plantillas/listaMensajes.hbs')
        .then(respuesta => respuesta.text())
}


socket.on('actualizarMensajes', Mensajes => {
    cargarMensajes(Mensajes)
});


function agregarMensaje(form) {
    const mensaje = {
        mail: form["mail"].value,
        mensaje: form["mensaje"].value,
        fecha: new Date()
    }
    socket.emit('nuevoMensaje', mensaje);
    form["mensaje"].value=""
    return false;
}