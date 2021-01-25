var zmq = require("zeromq");
var socketClient = zmq.socket("router");
var socketWorker = zmq.socket("router");

let cli = [], req = [], workers = [];
var cartPool = []


socketClient.on("message", (c,sep,m) => {
    var cartContent = []
    m = JSON.parse(m);
    var clientName = m["client"];

    if (workers.length == 0) {
        cli.push(c);
        req.push(m);
    }

    cartContent = checkCart(clientName, cartContent);

    m["cart"] = cartContent;
    socketWorker.send([workers.shift(), '', c, '', JSON.stringify(m)]);

});

socketWorker.on("message", (w,sep,c,sep2,r) => {
    if(c==''){workers.push(w); return}
    if(cli.length > 0){
        socketWorker.send([w,'',cli.shift(),'',req.shift()])
    } else {
        workers.push(w)
    }

    if (r != '') {
        r = JSON.parse(r)
        var clientName = r["client"]
        for (var i = 0; i < cartPool.length; i++) {
            if (clientName == cartPool[i]["id"]) {
                cartPool[i]["cart"] = r["cart"];
            }
        }
    }

    printCartPool();

    socketClient.send([c,'',JSON.stringify(r)])
});


function checkCart(clientName, cartContent) {
    var carro = {
        "id": clientName,
        "cart": []
    }

    var assigned = false;
    if (cartPool.length > 0) {
        for (var i = 0; i < cartPool.length; i++) {
            if (clientName == cartPool[i]["id"]) {
                console.log("El cliente " + clientName + " ya tiene un carrito asociado")
                assigned = true;
                cartContent = cartPool[i]["cart"];
            }
        }
        if (assigned == false) {
            cartPool.push(carro)
            assigned = false;
        }
    } else {
        console.log("No hay carritos")
        cartPool.push(carro)
    }

    return cartContent;
}

function printCartPool() {
    console.log("Carritos actuales:")
    for (var i = 0; i < cartPool.length; i++) {
        console.log("Dueño del carrito: " + cartPool[i]["id"] + " ,productos del carrito: " + cartPool[i]["cart"]+ "\n")
    }
}



socketClient.bind("tcp://*:9999", function (err) {
    if (err) {
        console.log("Error in connection 9999");
    }else {
        console.log("Client connected to port 9999")
    }
});

socketWorker.bind("tcp://*:9998", function (err) {
    if (err) {
        console.log("Error in connection 9998");
    }else {
        console.log("Worker connected to port 9998")
    }
});
