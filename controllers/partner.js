const pool = require('../database');

module.exports = {

    getAllProducts: async (req, res) => {
        const images = await pool.query('SELECT * FROM PRODUCTO WHERE PRODUCTO_TIPO = "IMAGEN" AND PRODUCTO_ESTADO = "ACTIVO" AND PERSONA_ID = ?', [req.user.PERSONA_ID]);
        const videos = await pool.query('SELECT * FROM PRODUCTO WHERE PRODUCTO_TIPO = "VIDEO" AND PRODUCTO_ESTADO = "ACTIVO" AND PERSONA_ID = ?', [req.user.PERSONA_ID]);

        res.render('partner/list', { images, videos });
    },

    //---------------------------------------------------------------
    // Imagenes
    //---------------------------------------------------------------

    createImagePage: async (req, res) => {
        const category = await pool.query('SELECT * FROM CATEGORIA WHERE CATEGORIA_ESTADO = "ACTIVO"');
        res.render('partner/addImage', { category });
    },

    createImagePost: async (req, res) => {
        console.log(req.body);

        var today = new Date();
        const productDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

        const { CALIFICACION_ID, CATEGORIA_ID, PRODUCTO_NOMBRE, PRODUCTO_DESCRIPCION, PRODUCTO_PRECIO, PRODUCTO_FECHAALTA, PRODUCTO_FECHABAJA, PRODUCTO_URL, PRODUCTO_TIPO, PRODUCTO_ESTADO } = req.body;

        const newProduct = {
            PERSONA_ID: req.user.PERSONA_ID,
            CALIFICACION_ID,
            CATEGORIA_ID,
            PRODUCTO_NOMBRE,
            PRODUCTO_DESCRIPCION,
            PRODUCTO_PRECIO,
            PRODUCTO_FECHAALTA,
            PRODUCTO_FECHABAJA,
            PRODUCTO_URL,
            PRODUCTO_TIPO,
            PRODUCTO_ESTADO,
        };

        newProduct.PRODUCTO_TIPO = 'IMAGEN'
        newProduct.PRODUCTO_ESTADO = 'ACTIVO';
        newProduct.PRODUCTO_NOMBRE = newProduct.PRODUCTO_NOMBRE.toUpperCase();
        newProduct.PRODUCTO_DESCRIPCION = newProduct.PRODUCTO_DESCRIPCION.toUpperCase();
        newProduct.PRODUCTO_FECHAALTA = productDate;

        try {
            if (req.files[0].filename) {
                newProduct.PRODUCTO_URL = await process.env.GALLERY_URL + req.files[0].filename;
            }
        } catch {
            newProduct.PRODUCTO_URL = await process.env.GALLERY_DEFAULT;
        }

        console.log(newProduct);
        await pool.query('INSERT INTO PRODUCTO set ?', [newProduct]);

        // req.flash('success', 'Producto Agregado');//Almacenamos el mensaje en success
        res.redirect('/partner');//redirecciona a la ruta products
    },

    editImagePage: async (req, res) => {
        const { producto_id } = req.params;

        const products = await pool.query('SELECT * FROM PRODUCTO, CATEGORIA WHERE CATEGORIA.CATEGORIA_ID = PRODUCTO.CATEGORIA_ID AND PRODUCTO.PRODUCTO_ID = ?', [producto_id]);

        const listcategory = await pool.query('SELECT * FROM CATEGORIA WHERE CATEGORIA_ESTADO = "ACTIVO" AND CATEGORIA.CATEGORIA_ID NOT IN (SELECT CATEGORIA_ID FROM PRODUCTO WHERE PRODUCTO_ID = ?)', [producto_id]);

        res.render('partner/editImage', { product: products[0], listcategory });
    },

    editImagePost: async (req, res) => {
        const { producto_id } = req.params;

        const rows = await pool.query('SELECT * FROM PRODUCTO WHERE PRODUCTO_ID = ?', [producto_id]);
        const products = rows[0];

        const { CALIFICACION_ID, CATEGORIA_ID, PRODUCTO_NOMBRE, PRODUCTO_DESCRIPCION, PRODUCTO_PRECIO, PRODUCTO_FECHAALTA, PRODUCTO_FECHABAJA, PRODUCTO_URL, PRODUCTO_ESTADO } = req.body;

        const newProduct = {
            CALIFICACION_ID,
            CATEGORIA_ID,
            PRODUCTO_NOMBRE,
            PRODUCTO_DESCRIPCION,
            PRODUCTO_PRECIO,
            PRODUCTO_FECHAALTA,
            PRODUCTO_FECHABAJA,
            PRODUCTO_URL,
            PRODUCTO_ESTADO,
        };

        console.log(newProduct);
        newProduct.PRODUCTO_NOMBRE = newProduct.PRODUCTO_NOMBRE.toUpperCase();
        newProduct.PRODUCTO_DESCRIPCION = newProduct.PRODUCTO_DESCRIPCION.toUpperCase();
        newProduct.PRODUCTO_FECHAALTA = products.PRODUCTO_FECHAALTA;
        newProduct.PRODUCTO_ESTADO = products.PRODUCTO_ESTADO;

        try {
            if (req.files[0].filename) {
                newProduct.PRODUCTO_URL = await process.env.GALLERY_URL + req.files[0].filename;
            }
        } catch {
            newProduct.PRODUCTO_URL = await process.env.GALLERY_DEFAULT;
        }

        console.log(newProduct);

        await pool.query('UPDATE PRODUCTO set ? WHERE PRODUCTO_ID = ?', [newProduct, producto_id]);
        // req.flash('success', 'Producto Actualizado');
        res.redirect('/partner');
    },

    deleteImage: async (req, res) => {
        const { producto_id } = req.params;

        var today = new Date();
        const productDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
        console.log(productDate);

        await pool.query('UPDATE PRODUCTO SET PRODUCTO_ESTADO = "ELIMINADO" WHERE PRODUCTO.PRODUCTO_ID = ?', [producto_id]);
        await pool.query('UPDATE PRODUCTO SET PRODUCTO_FECHABAJA = ? WHERE PRODUCTO.PRODUCTO_ID = ?', [productDate, producto_id]);

        // req.flash('success', 'Producto Eliminado');
        res.redirect('/partner');//redireccionamos a la misma lista products
    },

    //---------------------------------------------------------------
    // Galleria de Imagenes
    //---------------------------------------------------------------

    createImageGalleryPost: async (req, res) => {
        const { PRODUCTO_ID, IMAGEN_NOMBRE, IMAGEN_DESCRIPCION, IMAGEN_URL, IMAGEN_ESTADO } = req.body;

        try {
            if (req.files.length > 0) {
                for (var i = 0; i < req.files.length; i++) {
                    const newGallery = {
                        PRODUCTO_ID,
                        IMAGEN_NOMBRE,
                        IMAGEN_DESCRIPCION,
                        IMAGEN_URL,
                        IMAGEN_ESTADO
                    };

                    newGallery.IMAGEN_ESTADO = 'ACTIVO';
                    newGallery.IMAGEN_URL = await process.env.GALLERY_URL + req.files[i].filename;

                    console.log(newGallery);

                    await pool.query('INSERT INTO IMAGEN set ?', [newGallery]);
                }
            }
        } catch {
            // newGallery.IMAGEN_URL = await process.env.GALLERY_DEFAULT;
            res.redirect('/partner');
        }

        res.redirect('/partner');
    },

    updateImageGalleryPost: async (req, res) => {
        const category = await pool.query('SELECT * FROM CATEGORIA WHERE CATEGORIA_ESTADO = "ACTIVO"');
        res.render('partner/addImage', { category });
    },

    deleteImageGalleryGet: async (req, res) => {
        const category = await pool.query('SELECT * FROM CATEGORIA WHERE CATEGORIA_ESTADO = "ACTIVO"');
        res.render('partner/addImage', { category });
    },

    //
    //
    // 
    //
    //

    createVideoPage: async (req, res) => {
        const category = await pool.query('SELECT * FROM CATEGORIA WHERE CATEGORIA_ESTADO = "ACTIVO"');
        res.render('partner/addVideo', { category });
    },

    createVideoPost: async (req, res, cb) => {
        console.log(req.body);

        var today = new Date();
        const productDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

        const { CALIFICACION_ID, CATEGORIA_ID, PRODUCTO_NOMBRE, PRODUCTO_DESCRIPCION, PRODUCTO_PRECIO, PRODUCTO_FECHAALTA, PRODUCTO_FECHABAJA, PRODUCTO_URL, PRODUCTO_ESTADO } = req.body;

        const newProduct = {
            PERSONA_ID: req.user.PERSONA_ID,
            CALIFICACION_ID,
            CATEGORIA_ID,
            PRODUCTO_NOMBRE,
            PRODUCTO_DESCRIPCION,
            PRODUCTO_PRECIO,
            PRODUCTO_FECHAALTA,
            PRODUCTO_FECHABAJA,
            PRODUCTO_URL,
            PRODUCTO_ESTADO,
        };

        newProduct.PRODUCTO_TIPO = 'VIDEO'
        newProduct.PRODUCTO_ESTADO = 'ACTIVO';
        newProduct.PRODUCTO_NOMBRE = newProduct.PRODUCTO_NOMBRE.toUpperCase();
        newProduct.PRODUCTO_DESCRIPCION = newProduct.PRODUCTO_DESCRIPCION.toUpperCase();
        newProduct.PRODUCTO_FECHAALTA = productDate;

        try {
            if (req.file.filename) {
                // await fs.unlink(products.PRODUCTO_URL);
                newProduct.PRODUCTO_URL = await process.env.GALLERY_URL + req.file.filename;
            }
        } catch {
            // newProduct.PRODUCTO_IMAGEN = products.PRODUCTO_IMAGEN;
            newProduct.PRODUCTO_URL = products.PRODUCTO_URL;
        }

        console.log(newProduct);//Muestra datos del formulario
        console.log(req.file);

        await pool.query('INSERT INTO PRODUCTO set ?', [newProduct]);

        // req.flash('success', 'Producto Agregado');//Almacenamos el mensaje en success
        res.redirect('/partner');//redirecciona a la ruta products
    },

    editVideoPage: async (req, res) => {
        const { producto_id } = req.params;

        const products = await pool.query('SELECT * FROM PRODUCTO, CATEGORIA WHERE CATEGORIA.CATEGORIA_ID = PRODUCTO.CATEGORIA_ID AND PRODUCTO.PRODUCTO_ID = ?', [producto_id]);

        const listcategory = await pool.query('SELECT * FROM CATEGORIA WHERE CATEGORIA_ESTADO = "ACTIVO" AND CATEGORIA.CATEGORIA_ID NOT IN (SELECT CATEGORIA_ID FROM PRODUCTO WHERE PRODUCTO_ID = ?)', [producto_id]);

        res.render('partner/editVideo', { product: products[0], listcategory });
    },

    editVideoPost: async (req, res) => {
        const { producto_id } = req.params;

        const rows = await pool.query('SELECT * FROM PRODUCTO WHERE PRODUCTO_ID = ?', [producto_id]);
        const products = rows[0];

        const { CALIFICACION_ID, CATEGORIA_ID, PRODUCTO_NOMBRE, PRODUCTO_DESCRIPCION, PRODUCTO_PRECIO, PRODUCTO_FECHAALTA, PRODUCTO_FECHABAJA, PRODUCTO_URL, PRODUCTO_ESTADO } = req.body;

        const newProduct = {
            CALIFICACION_ID,
            CATEGORIA_ID,
            PRODUCTO_NOMBRE,
            PRODUCTO_DESCRIPCION,
            PRODUCTO_PRECIO,
            PRODUCTO_FECHAALTA,
            PRODUCTO_FECHABAJA,
            PRODUCTO_URL,
            PRODUCTO_ESTADO,
        };

        console.log(newProduct);
        newProduct.PRODUCTO_NOMBRE = newProduct.PRODUCTO_NOMBRE.toUpperCase();
        newProduct.PRODUCTO_DESCRIPCION = newProduct.PRODUCTO_DESCRIPCION.toUpperCase();
        newProduct.PRODUCTO_FECHAALTA = products.PRODUCTO_FECHAALTA;
        newProduct.PRODUCTO_ESTADO = products.PRODUCTO_ESTADO;

        try {
            if (req.file.filename) {
                // await fs.unlink(products.PRODUCTO_URL);
                // newProduct.PRODUCTO_IMAGEN = await req.file.filename;
                newProduct.PRODUCTO_URL = await process.env.GALLERY_URL + req.file.filename;
            }
        } catch {
            // newProduct.PRODUCTO_IMAGEN = products.PRODUCTO_IMAGEN;
            newProduct.PRODUCTO_URL = products.PRODUCTO_URL;
        }

        console.log(newProduct);


        await pool.query('UPDATE PRODUCTO set ? WHERE PRODUCTO_ID = ?', [newProduct, producto_id]);
        // req.flash('success', 'Producto Actualizado');
        res.redirect('/partner');
    },


    deleteVideo: async (req, res) => {
        const { producto_id } = req.params;

        var today = new Date();
        const productDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
        console.log(productDate);

        await pool.query('UPDATE PRODUCTO SET PRODUCTO_ESTADO = "ELIMINADO" WHERE PRODUCTO.PRODUCTO_ID = ?', [producto_id]);
        await pool.query('UPDATE PRODUCTO SET PRODUCTO_FECHABAJA = ? WHERE PRODUCTO.PRODUCTO_ID = ?', [productDate, producto_id]);

        // req.flash('success', 'Producto Eliminado');
        res.redirect('/partner');//redireccionamos a la misma lista products
    },

    //---------------------------------------------------------------
    // Galleria de Imagenes
    //---------------------------------------------------------------

    createVideoGalleryPost: async (req, res) => {
        const category = await pool.query('SELECT * FROM CATEGORIA WHERE CATEGORIA_ESTADO = "ACTIVO"');
        res.render('partner/addImage', { category });
    },

    updateVideoGalleryPost: async (req, res) => {
        const category = await pool.query('SELECT * FROM CATEGORIA WHERE CATEGORIA_ESTADO = "ACTIVO"');
        res.render('partner/addImage', { category });
    },

    deleteVideoGalleryGet: async (req, res) => {
        const category = await pool.query('SELECT * FROM CATEGORIA WHERE CATEGORIA_ESTADO = "ACTIVO"');
        res.render('partner/addImage', { category });
    },
    //
    //
    //
    //
    //
    //
    //

    // getAllProductsPartner: async (req, res) => {
    //     const images = await pool.query('SELECT * FROM PRODUCTO WHERE PRODUCTO_TIPO = "IMAGEN" AND PRODUCTO_ESTADO = "POR_APROBAR"');
    //     const videos = await pool.query('SELECT * FROM PRODUCTO WHERE PRODUCTO_TIPO = "VIDEO" AND PRODUCTO_ESTADO = "POR_APROBAR"');
    //     // const images = await pool.query('SELECT * FROM PRODUCTO WHERE PRODUCTO_TIPO = "IMAGEN" AND PRODUCTO_ESTADO = "ACTIVO"');
    //     // const videos = await pool.query('SELECT * FROM PRODUCTO WHERE PRODUCTO_TIPO = "VIDEO" AND PRODUCTO_ESTADO = "ACTIVO"');
    //     res.render('partner/listPartner', { images, videos });
    // },

    // addPartner: async (req, res) => {
    //     const { producto_id } = req.params;

    //     var today = new Date();
    //     const productDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    //     console.log(productDate);

    //     await pool.query('UPDATE PRODUCTO SET PRODUCTO_ESTADO = "ACTIVO" WHERE PRODUCTO.PRODUCTO_ID = ?', [producto_id]);
    //     await pool.query('UPDATE PRODUCTO SET PRODUCTO_FECHAALTA = ? WHERE PRODUCTO.PRODUCTO_ID = ?', [productDate, producto_id]);

    //     // req.flash('success', 'Producto Eliminado');
    //     res.redirect('/partner/listPartner');//redireccionamos a la misma lista products
    // },

    // deletePartner: async (req, res) => {
    //     const { producto_id } = req.params;

    //     var today = new Date();
    //     const productDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    //     console.log(productDate);

    //     await pool.query('UPDATE PRODUCTO SET PRODUCTO_ESTADO = "ELIMINADO" WHERE PRODUCTO.PRODUCTO_ID = ?', [producto_id]);
    //     await pool.query('UPDATE PRODUCTO SET PRODUCTO_FECHABAJA = ? WHERE PRODUCTO.PRODUCTO_ID = ?', [productDate, producto_id]);

    //     // req.flash('success', 'Producto Eliminado');
    //     res.redirect('/partner/listPartner');//redireccionamos a la misma lista products
    // },

}