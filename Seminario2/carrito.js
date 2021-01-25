var mgdb = require("mongodb");
var assert = require("assert");

var mongoclient = mgdb.MongoClient;

var url = 'mongodb://localhost:27017/almacen';

//Conectar con la base de datos
mongoclient.connect(url, function(err, db) {
    assert.equal(err, null);
    console.log("conectado");

    // TESTS
      addProduct(db, 'hierros', 1);
      addProduct(db, 'palos', 2);
      setTimeout(function() {
      removeProduct('hierros', 1);	
      }, 1000);
    
});

var carrito = [];

function findProduct(db, desc, qty, callback) {  
    var res = db.collection("products").find({ desc: desc}).toArray(function(err, p) {
	    if (p[0]["stock"] >= qty) {
		console.log("Hay stock del producto " + p[0]["desc"]);
		callback();
            } else console.log("No hay stock suficiente de " + p[0]["desc"]);
    });
};

function searchIndex(array, atribut, product) {
    for (var i = 0; i < array.length; i += 1) {
        if (array[i][atribut] === product) {
            return i;
        }
    }
    return -1;
}

function addProduct(db, product, qty) {
	var exists = true;	
	findProduct(db, product, qty, function() {					
		carrito.push(product);
		console.log("Añadido al carrito " + qty + " ud/uds. de " + product);
	});
}

function removeProduct(product, qty) {
    var exists = true;
    carrito.forEach(function(element) {
        if (element.desc == product) {
            exists = true;
            element.cantidad = element.cantidad - qty;
            if (element.cantidad <= 0) {
                var productPos = searchIndex(carrito, "desc", product);
                if (productPos > -1) {
                    carrito.splice(productPos, 1);
                }
            }
        }
    });
    console.log("Se han eliminado del carrito " + qty + "ud./uds. de " + product); 
    if (!exists) {
        console.log("No existe en el carrito el producto " + product);
    }
};
