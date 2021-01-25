var express = require('express');
const app = express();
mgdb = require('mongodb');
var database = "";
mgdb.MongoClient.connect('mongodb://localhost:27017/almacen', function(err, db) {
	if (err) throw err;
	console.log('Conectado');
	database = db;
});

const carritoController = require('./carrito');

app.get("/", function(req, res) {
	res.send("Servicio REST para el carrito de la compra en NodeJS \n");
});

app.get("/carrito", function(req, res) {
	res.send(carritoController.getCarrito());
});

app.get("/add/:product/:qty", function(req, res) {
	res.send(carritoController.addProduct(database, req.params.product, req.params.qty)); 
});

app.get("/remove/:product/:qty", function(req, res) {
	res.send(carritoController.removeProduct(req.params.product, req.params.qty));
});

app.listen(3000, function() {
	console.log("Servidor escuchando en http://localhost:3000 \n");
});
