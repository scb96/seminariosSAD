var zmq = require("zeromq");
var req = zmq.socket("req");
var carrito = require("./carrito.js").Carrito

req.identity='Worker1'+process.pid

req.connect('tcp://localhost:9998')

req.on('message', (c,sep,msg)=> {
    console.log("Mensaje del broker recibido")
    msg = JSON.parse(msg);
    var cart = new carrito(msg["cart"]);

    switch (msg["method"]) {
        case "add":
            cart.addProduct(msg["product"]);
            break;
        case "remove":
            cart.removeProduct(msg["product"]);
            break;
        case "close":
            cart.products = [];
            break;
	case "get":
	    cart.getCarrito()
	    break;
        default:
            break;
    }
    msg["cart"] = cart.products
    console.log("El carro es de: "+msg["client"]+" , la operación "+msg["method"]+ " , y el producto "+msg["product"]);
    setTimeout(()=> {
        req.send([c,'',JSON.stringify(msg)])
    }, 2000)
})
req.send(['','',''])
