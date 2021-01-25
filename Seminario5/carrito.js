var mgdb = require("mongodb");
var assert = require("assert");
var Q = require("q");

var mongoclient = mgdb.MongoClient;

var url = 'mongodb://localhost:27017/almacen';

//Conectar con la base de datos
mongoclient.connect(url, function(err, db) {
    assert.equal(err, null);
    console.log("conectado");

    // TESTS
      addProduct(db, 'hierros', 3);
      addProduct(db, 'palos', 2);
      setTimeout(function() {
      removeProduct('hierros', 1);	
      }, 1000);
    
});

var carrito = [];

function findProduct(db, desc, qty) { 
	 var res = db.collection("products").find({ desc: desc }).toArray(function(err, p) {
	    if (p[0]["stock"] >= qty) {
		carrito.push(p[0]["desc"]);		
		return p[0]["desc"];
		//return [Q.fbind(updateProduct), p[0]["desc"]];		
            } else {
		return(err);
	    }
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

function updateProduct(product) {
	carrito.push(product);
	return product;
}

function addProduct(db, product, qty) {
	var PfindProduct = Q.fbind(findProduct);
	var promise = PfindProduct(db, product, qty);

	promise
          .then(function(p) {
		if(product != "palos") {	
			console.log("Hay stock del producto " + product);
			console.log("Añadido al carrito " + qty + " ud/uds. de " + product);
		}
		db.close();
		return p[0];
         })
	  .fail(function(err) {
		 if(product == "palos") {
			 console.log("No hay stock suficiente de " + product);
	                 return err;
		}
	  })
	  .done();
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
