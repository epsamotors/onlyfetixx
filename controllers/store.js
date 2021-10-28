const pool = require('../database');
const Cart = require('../models/cart');
const stripe = require('stripe')('sk_test_51JnQDrEcCS5fMXbfMmBSxCUa0z6tOAXgLeGWcVgnNxYQtfCqmJcGaakadgHqHamcjZyxIco4dMzJ1dSexzh2aXIn00Ny24N1oK');

module.exports = {

    getAllProducts: async (req, res) => {
        const images = await pool.query('SELECT * FROM PRODUCTO WHERE PRODUCTO_TIPO = "IMAGEN" AND PRODUCTO_ESTADO = "ACTIVO" ORDER BY PRODUCTO.PRODUCTO_ID DESC LIMIT 8');
        const videos = await pool.query('SELECT * FROM PRODUCTO WHERE PRODUCTO_TIPO = "VIDEO" AND PRODUCTO_ESTADO = "ACTIVO" ORDER BY PRODUCTO.PRODUCTO_ID DESC LIMIT 8');
        res.render('store/shop', { images, videos });
    },

    getSearchProducts: async (req, res) => {
        const { buscar } = req.query;

        var findProducts = false;

        const category = await pool.query('SELECT * FROM CATEGORIA WHERE CATEGORIA_ESTADO = "ACTIVO"');

        const products = await pool.query('SELECT * FROM PRODUCTO WHERE PRODUCTO_NOMBRE = ?', [buscar]);

        if (products.length == 0) {
            findProducts = true;
        }

        res.render('store/shopList', { products, category, findProducts });
    },


    getCategoryProducts: async (req, res) => {
        const { CATEGORIA_ID } = req.query;
        var findProducts = false;

        const category = await pool.query('SELECT * FROM CATEGORIA WHERE CATEGORIA_ESTADO = "ACTIVO"');

        const products = await pool.query('SELECT * FROM PRODUCTO, CATEGORIA WHERE CATEGORIA.CATEGORIA_ID = PRODUCTO.CATEGORIA_ID AND CATEGORIA.CATEGORIA_ID = ?', [CATEGORIA_ID]);

        if (products.length == 0) {
            findProducts = true;
        }

        res.render('store/shopList', { products, category, findProducts });

    },

    getDetailProducts: async (req, res) => {
        const { producto_id } = req.params;
        const details = await pool.query('SELECT * FROM PRODUCTO WHERE PRODUCTO.PRODUCTO_ID= ?', [producto_id]);
        const comments = await pool.query('SELECT * FROM PRODUCTO, PERSONA, COMENTARIO WHERE PRODUCTO.PRODUCTO_ID = COMENTARIO.PRODUCTO_ID AND PERSONA.PERSONA_ID = COMENTARIO.PERSONA_ID AND PRODUCTO.PRODUCTO_ID = ? ORDER BY PRODUCTO.PRODUCTO_ID DESC LIMIT 5', [producto_id]);
        const commentCount = comments.length;

        const tipe = details[0].PRODUCTO_TIPO;
        var isVideo = false;

        if (tipe == "VIDEO") {
            isVideo = true;
        }

        const feachaAlta = details[0].PRODUCTO_FECHAALTA.toLocaleDateString('sv-SE');

        res.render('store/detail', { detail: details[0], feachaAlta, isVideo, comments, commentCount });
    },

    addToCart: async (req, res) => {
        const { PRODUCTO_ID } = req.body;
        const add = await pool.query('SELECT * FROM PRODUCTO WHERE PRODUCTO.PRODUCTO_ID = ?', [PRODUCTO_ID]);
        const addedProduct = add[0];

        const addId = await pool.query('SELECT * FROM PRODUCTO WHERE PRODUCTO.PRODUCTO_ID = ?', [PRODUCTO_ID]);
        const productsId = addId[0];

        const idUser = req.user.PERSONA_ID;

        Cart.save(productsId, addedProduct, idUser);
        res.redirect('/shop');
    },

    getCart: async (req, res) => {
        const idUser = req.user.PERSONA_ID;

        const products = Cart.getCart(idUser);

        var total = products.reduce((sum, value) => (typeof value.PRODUCTO_PRECIO == "number" ? sum + value.PRODUCTO_PRECIO : sum), 0);// Sumar total productos

        var totalPrice = total.toFixed(0);

        res.render('store/cart', { products, totalPrice });
    },

    deleteInCart: async (req, res) => {
        const idUser = req.user.PERSONA_ID;
        const { PRODUCTO_ID } = req.body;
        Cart.delete(idUser, PRODUCTO_ID);
        res.redirect('/cart');
    },

    deleteCart: async (req, res) => {
        const idUser = req.user.PERSONA_ID;
        Cart.deleteCart(idUser);
        req.flash('message', 'Carrito vaciado correctamente');
        res.redirect('/shop');
    },

    buyCart: async (req, res) => {
        const userId = req.user.PERSONA_ID;

        var today = new Date();
        const sellDate = today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();

        const products = Cart.getCart(userId);

        var total = products.reduce((sum, value) => (typeof value.PRODUCTO_PRECIO == "number" ? sum + value.PRODUCTO_PRECIO : sum), 0);// Sumar total productos
        var totalPrice = total.toFixed(0);

        const { VENTA_TOTAL, VENTA_ESTADO, VENTA_FECHA } = req.body;

        // for (const i in products) {
        //     console.log(products[i]);
        // }

        const newSell = {
            PERSONA_ID: req.user.PERSONA_ID,
            VENTA_TOTAL,
            VENTA_FECHA,
            VENTA_ESTADO
        }

        newSell.VENTA_TOTAL = totalPrice,
            newSell.VENTA_FECHA = sellDate;
        newSell.VENTA_ESTADO = 'Activo';

        console.log(newSell);

        await pool.query('INSERT INTO VENTA set ?', [newSell]);


        const row = await pool.query('SELECT MAX(VENTA_ID) AS ID FROM VENTA, PERSONA WHERE VENTA.PERSONA_ID = PERSONA.PERSONA_ID AND PERSONA.PERSONA_ID = ?', [req.user.PERSONA_ID]);
        const lastId = row[0];
        const lastSell = lastId.ID;
        // const activado = 'ACTIVO';

        for (let i of products) {
            const detailSell = {
                VENTA_ID: lastSell,
                PRODUCTO_ID: i.PRODUCTO_ID,
                DETALLEVENTA_CANTIDAD: '',
                DETALLEVENTA_PRECIOUNITARIO: i.PRODUCTO_PRECIO,
                DETALLEVENTA_DESCUENTO: '',
                DETALLEVENTA_TOTAL: i.PRODUCTO_PRECIO,
            }

            console.log(detailSell);

            await pool.query('INSERT INTO DETALLE_VENTA SET ?', [detailSell]);
        }

        Cart.deleteCart(userId);

        // req.flash('success', 'Compra exitosa');
        res.redirect('/profile');

    },


    laterCart: async (req, res) => {
       

            
        res.send('Hola mundo');

     
        // req.flash('success', 'Compra exitosa');
        //res.redirect('/profile');

    },

    checkout: async (req, res) => {
        console.log(req.body);
        const { stripeEmail, stripeToken } = req.body
        //Almacenamos el comprador
        const customer = await stripe.customers.create({
            email: stripeEmail,
            source: stripeToken
        })
        //Almacenar orden de compra
        const charge = await stripe.charges.create({
            amount: '3000',
            currency: 'usd',
            customer: customer.id,
            description: 'compra de prueba'
        })
        console.log(charge.id);
        

        res.redirect('/profile');
    },
};