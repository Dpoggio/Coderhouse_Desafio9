const { Router } = require('express');
const routerProductosTest = Router();

function getRequestID(req){
    if (isNaN(req.params.id)) {
        throw new IdNoNumerico()
    }
    const id = parseInt(req.params.id)
    return id
}

/**** Rutas ****/
routerProductosTest.get('/', async (req, res, next) => {  
    res.json({})
})


exports.routerProductosTest = routerProductosTest;