var mgdb = require("mongodb");
var assert = require("assert");

var mongoclient = mgdb.MongoClient;

var url = 'mongodb://localhost:27017/almacen';

mongoclient.connect(url, function(err, db) {
	assert.equal(err,null);
	//console.log("Conectado");
});
var carrito = [];

findProduct = function(db, desc, qty, callback) {  
    var res = db.collection("products").find({ desc: desc}).toArray(function(err, p) {
	    if (p[0]["stock"] >= qty) {
		console.log("Hay stock del producto " + p[0]["desc"]);
		callback();
            } else console.log("No hay stock suficiente de " + p[0]["desc"]);
    });
};

exports.searchIndex = function(array, atribut, product) {
    for (var i = 0; i < array.length; i += 1) {
        if (array[i][atribut] === product) {
            return i;
        }
    }
    return -1;
}

exports.addProduct = function(db, product, qty) {
	var exists = true;	
	findProduct(db, product, qty, function() {					
		carrito.push(product);
		console.log("Añadido al carrito " + qty + " ud/uds. de " + product);
	});
	
}

exports.getCarrito = function() {
	return carrito + "\n";
}

exports.removeProduct = function(product, qty) {
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
        console.log(
            "No existe en el carrito el producto " + product);
    }
};
