let cart = [];

module.exports = class Cart {

    static save(idProduct, product, idUser) {

        const userBuy = idUser,

            productId = idProduct.PRODUCTO_ID,

            productNombre = product.PRODUCTO_NOMBRE,
            productPrecio = product.PRODUCTO_PRECIO,
            productImagen = product.PRODUCTO_URL

        const existingProductIndex = cart.find(element => element.idUser == userBuy && element.PRODUCTO_ID == productId);

        if (existingProductIndex) {
            console.log('Producto ya existente');
        } else {
            cart.push({
                idUser: userBuy,
                PRODUCTO_ID: productId,
                PRODUCTO_NOMBRE: productNombre,
                PRODUCTO_PRECIO: productPrecio,
                PRODUCTO_URL: productImagen,
            });
        }
    }

    static getCart(userId) {
        var products = cart.filter(function (userProduct) { return userProduct.idUser == userId; });
        return products;
    }

    static delete(userId, productId) {
        const isExisting = cart.findIndex(element => element.idUser == userId && element.PRODUCTO_ID == productId);
        if (isExisting >= 0) {
            cart.splice(isExisting, 1);
        }
    }

    static deleteCart(userId) {
        while (cart.findIndex(e => e.idUser == userId) >= 0)
            cart.splice(cart.findIndex(f => f.idUser == userId), 1);
    }
}