class Carrito {

constructor(products) {
	if(products == null) {
		this.products = [];
	} else {
		this.products = products;
	}
}

searchIndex(array, product) {
    for (var i = 0; i < array.length; i += 1) {
        if (array[i] === product) {
            return i;
        }
    }
    return -1;
}

getCarrito() {
	return this.products;
}

addProduct(product, qty) {	
	this.products.push(product);
}

removeProduct(product, qty) {
     for (var i = 0; i < this.products; i+=1) { 
       if(this.products[i] == product) {
	this.products.splice(i, 1);
	}
     }
    

}
}
exports.Carrito = Carrito
