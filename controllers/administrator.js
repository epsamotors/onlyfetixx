
const pool = require('../database');

module.exports = {

    getAllProducts: async (req, res) => {
        const images = await pool.query('SELECT * FROM PRODUCTO WHERE PRODUCTO_TIPO = "IMAGEN" AND PRODUCTO_ESTADO = "ACTIVO"');
        const videos = await pool.query('SELECT * FROM PRODUCTO WHERE PRODUCTO_TIPO = "VIDEO" AND PRODUCTO_ESTADO = "ACTIVO"');
        res.render('administrator/list', { images, videos });
    },

    createImagePage: async (req, res) => {
        const category = await pool.query('SELECT * FROM CATEGORIA WHERE CATEGORIA_ESTADO = "ACTIVO"');
        res.render('administrator/addImage', { category });
    },

    createImagePost: async (req, res) => {
        console.log(req.body);

        var today = new Date();
        const productDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

        const { PERSONA_ID, CALIFICACION_ID, CATEGORIA_ID, PRODUCTO_NOMBRE, PRODUCTO_DESCRIPCION, PRODUCTO_PRECIO, PRODUCTO_FECHAALTA, PRODUCTO_FECHABAJA, PRODUCTO_URL, PRODUCTO_TIPO, PRODUCTO_ESTADO } = req.body;

        const newProduct = {
            PERSONA_ID,
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

        // newProduct.PERSONA_ID = '1';
        newProduct.PRODUCTO_TIPO = 'IMAGEN'
        newProduct.PRODUCTO_ESTADO = 'ACTIVO';
        newProduct.PRODUCTO_NOMBRE = newProduct.PRODUCTO_NOMBRE.toUpperCase();
        newProduct.PRODUCTO_DESCRIPCION = newProduct.PRODUCTO_DESCRIPCION.toUpperCase();
        newProduct.PRODUCTO_FECHAALTA = productDate;

        try {
            if (req.file.filename) {
                // newProduct.PRODUCTO_IMAGEN = await req.file.filename;
                newProduct.PRODUCTO_URL = await process.env.GALLERY_URL + req.file.filename;
            }
        } catch {
            // newProduct.PRODUCTO_IMAGEN = 'product.jpg';
            newProduct.PRODUCTO_URL = await process.env.GALLERY_DEFAULT;
        }

        console.log(newProduct);//Muestra datos del formulario
        console.log(req.file);

        await pool.query('INSERT INTO PRODUCTO set ?', [newProduct]);

        // req.flash('success', 'Producto Agregado');//Almacenamos el mensaje en success
        res.redirect('/administrator');//redirecciona a la ruta products
    },

    editImagePage: async (req, res) => {
        const { producto_id } = req.params;

        const products = await pool.query('SELECT * FROM PRODUCTO, CATEGORIA WHERE CATEGORIA.CATEGORIA_ID = PRODUCTO.CATEGORIA_ID AND PRODUCTO.PRODUCTO_ID = ?', [producto_id]);

        const listcategory = await pool.query('SELECT * FROM CATEGORIA WHERE CATEGORIA_ESTADO = "ACTIVO" AND CATEGORIA.CATEGORIA_ID NOT IN (SELECT CATEGORIA_ID FROM PRODUCTO WHERE PRODUCTO_ID = ?)', [producto_id]);

        res.render('administrator/editImage', { product: products[0], listcategory });
    },

    editImagePost: async (req, res) => {
        const { producto_id } = req.params;

        const rows = await pool.query('SELECT * FROM PRODUCTO WHERE PRODUCTO_ID = ?', [producto_id]);
        const products = rows[0];

        const { PERSONA_ID, CALIFICACION_ID, CATEGORIA_ID, PRODUCTO_NOMBRE, PRODUCTO_DESCRIPCION, PRODUCTO_PRECIO, PRODUCTO_FECHAALTA, PRODUCTO_FECHABAJA, PRODUCTO_URL, PRODUCTO_ESTADO } = req.body;

        const newProduct = {
            PERSONA_ID,
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

        try {
            if (req.file.filename) {
                // await fs.unlink(products.PRODUCTO_URL);
                newProduct.PRODUCTO_URL = await process.env.GALLERY_URL + req.file.filename;
            }
        } catch {
            // newProduct.PRODUCTO_IMAGEN = products.PRODUCTO_IMAGEN;
            newProduct.PRODUCTO_URL = products.PRODUCTO_URL;
        }

        newProduct.PRODUCTO_FECHAALTA = products.PRODUCTO_FECHAALTA;
        newProduct.PRODUCTO_ESTADO = products.PRODUCTO_ESTADO;

        console.log(newProduct);


        await pool.query('UPDATE PRODUCTO set ? WHERE PRODUCTO_ID = ?', [newProduct, producto_id]);
        // req.flash('success', 'Producto Actualizado');
        res.redirect('/administrator');
    },


    deleteImage: async (req, res) => {
        const { producto_id } = req.params;

        var today = new Date();
        const productDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
        console.log(productDate);

        await pool.query('UPDATE PRODUCTO SET PRODUCTO_ESTADO = "ELIMINADO" WHERE PRODUCTO.PRODUCTO_ID = ?', [producto_id]);
        await pool.query('UPDATE PRODUCTO SET PRODUCTO_FECHABAJA = ? WHERE PRODUCTO.PRODUCTO_ID = ?', [productDate, producto_id]);

        // req.flash('success', 'Producto Eliminado');
        res.redirect('/administrator');//redireccionamos a la misma lista products
    },

    //
    //
    // 
    //
    //

    createVideoPage: async (req, res) => {
        const category = await pool.query('SELECT * FROM CATEGORIA WHERE CATEGORIA_ESTADO = "ACTIVO"');
        res.render('administrator/addVideo', { category });
    },

    createVideoPost: async (req, res, cb) => {
        console.log(req.body);

        var today = new Date();
        const productDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();

        const { PERSONA_ID, CALIFICACION_ID, CATEGORIA_ID, PRODUCTO_NOMBRE, PRODUCTO_DESCRIPCION, PRODUCTO_PRECIO, PRODUCTO_FECHAALTA, PRODUCTO_FECHABAJA, PRODUCTO_URL, PRODUCTO_ESTADO } = req.body;

        const newProduct = {
            PERSONA_ID,
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

        // newProduct.PERSONA_ID = '1';
        newProduct.PRODUCTO_TIPO = 'VIDEO'
        newProduct.PRODUCTO_ESTADO = 'ACTIVO';
        newProduct.PRODUCTO_NOMBRE = newProduct.PRODUCTO_NOMBRE.toUpperCase();
        newProduct.PRODUCTO_DESCRIPCION = newProduct.PRODUCTO_DESCRIPCION.toUpperCase();
        newProduct.PRODUCTO_FECHAALTA = productDate;

        try {
            if (req.file.filename) {
                // newProduct.PRODUCTO_IMAGEN = await req.file.filename;
                newProduct.PRODUCTO_URL = await process.env.GALLERY_URL + req.file.filename;
            }
        } catch {
            // newProduct.PRODUCTO_IMAGEN = 'product.jpg';
            newProduct.PRODUCTO_URL = await process.env.GALLERY_DEFAULT;
        }

        console.log(newProduct);//Muestra datos del formulario
        console.log(req.file);

        await pool.query('INSERT INTO PRODUCTO set ?', [newProduct]);

        // req.flash('success', 'Producto Agregado');//Almacenamos el mensaje en success
        res.redirect('/administrator');//redirecciona a la ruta products
    },

    editVideoPage: async (req, res) => {
        const { producto_id } = req.params;

        const products = await pool.query('SELECT * FROM PRODUCTO, CATEGORIA WHERE CATEGORIA.CATEGORIA_ID = PRODUCTO.CATEGORIA_ID AND PRODUCTO.PRODUCTO_ID = ?', [producto_id]);

        const listcategory = await pool.query('SELECT * FROM CATEGORIA WHERE CATEGORIA_ESTADO = "ACTIVO" AND CATEGORIA.CATEGORIA_ID NOT IN (SELECT CATEGORIA_ID FROM PRODUCTO WHERE PRODUCTO_ID = ?)', [producto_id]);

        res.render('administrator/editVideo', { product: products[0], listcategory });
    },

    editVideoPost: async (req, res) => {
        const { producto_id } = req.params;

        const rows = await pool.query('SELECT * FROM PRODUCTO WHERE PRODUCTO_ID = ?', [producto_id]);
        const products = rows[0];

        const { PERSONA_ID, CALIFICACION_ID, CATEGORIA_ID, PRODUCTO_NOMBRE, PRODUCTO_DESCRIPCION, PRODUCTO_PRECIO, PRODUCTO_FECHAALTA, PRODUCTO_FECHABAJA, PRODUCTO_URL, PRODUCTO_ESTADO } = req.body;

        const newProduct = {
            PERSONA_ID,
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

        newProduct.PRODUCTO_FECHAALTA = products.PRODUCTO_FECHAALTA;
        newProduct.PRODUCTO_ESTADO = products.PRODUCTO_ESTADO;

        console.log(newProduct);


        await pool.query('UPDATE PRODUCTO set ? WHERE PRODUCTO_ID = ?', [newProduct, producto_id]);
        // req.flash('success', 'Producto Actualizado');
        res.redirect('/administrator');
    },


    deleteVideo: async (req, res) => {
        const { producto_id } = req.params;

        var today = new Date();
        const productDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
        console.log(productDate);

        await pool.query('UPDATE PRODUCTO SET PRODUCTO_ESTADO = "ELIMINADO" WHERE PRODUCTO.PRODUCTO_ID = ?', [producto_id]);
        await pool.query('UPDATE PRODUCTO SET PRODUCTO_FECHABAJA = ? WHERE PRODUCTO.PRODUCTO_ID = ?', [productDate, producto_id]);

        // req.flash('success', 'Producto Eliminado');
        res.redirect('/administrator');//redireccionamos a la misma lista products
    },

    //
    //
    //
    //
    //
    //
    //

    getAllPartners: async (req, res) => {
        const partner = await pool.query('SELECT * FROM PERSONA WHERE ROL_ID = "2"');
        res.render('administrator/listPartner', { partner });
    },

    // ------------------------------------------------------------------------------------------------------
    // DAR PERMISOS DE ADMINISTRADOR
    // ------------------------------------------------------------------------------------------------------
    activePartnerGet: async (req, res) => { //Obtenemos pagina de admin
        var noUser = false;
        res.render('administrator/addPartner', { noUser });
    },

    activePartnerSearch: async (req, res) => { //Buscar usuarios por su nombre
        const { buscar } = req.query;
        var noUser = false;

        if (buscar) {
            const persona = await pool.query('SELECT * FROM PERSONA WHERE PERSONA.ROL_ID = 3 AND PERSONA_ESTADO = "ACTIVO" AND PERSONA_CORREO =  ?', [buscar]);

            if (persona.length == 0) {
                noUser = true;
            }

            res.render('administrator/addPartner', { persona, noUser });
        } else {
            noUser = true;
            res.render('administrator/listPartner', { persona, noUser });
        }
    },

    activePartnerPost: async (req, res) => { //Activamos usuario por su ID
        const { id } = req.params;
        await pool.query('UPDATE PERSONA SET ROL_ID = 2 WHERE PERSONA.PERSONA_ID = ?', [id]);
        const rows = await pool.query('SELECT PERSONA_NOMBRE FROM PERSONA WHERE PERSONA_ID = ?', [id]);
        const persona = rows[0].PERSONA_NOMBRE;
        req.flash('success', 'El usuario ' + persona + ' ahora posee permisos de colaborador');
        res.redirect('/administrator/listPartner');
    },

    // ------------------------------------------------------------------------------------------------------
    //  Galleria del Asociado
    // ------------------------------------------------------------------------------------------------------

    getAllGalleryPartner: async (req, res) => {
        const { id } = req.params;
        const partner = await pool.query('SELECT * FROM PERSONA WHERE PERSONA_ID = ?', [id]);
        const images = await pool.query('SELECT * FROM PRODUCTO WHERE PRODUCTO_TIPO = "IMAGEN" AND PRODUCTO_ESTADO = "POR_APROBAR" AND PERSONA_ID = ?', [id]);
        const videos = await pool.query('SELECT * FROM PRODUCTO WHERE PRODUCTO_TIPO = "VIDEO" AND PRODUCTO_ESTADO = "POR_APROBAR" AND PERSONA_ID = ?', [id]);
        res.render('administrator/listGalleryPartner', { profile: partner[0], images, videos });
    },

    addGalleryPartner: async (req, res) => {
        const { producto_id } = req.params;

        var today = new Date();
        const productDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
        console.log(productDate);

        await pool.query('UPDATE PRODUCTO SET PRODUCTO_ESTADO = "ACTIVO" WHERE PRODUCTO.PRODUCTO_ID = ?', [producto_id]);
        await pool.query('UPDATE PRODUCTO SET PRODUCTO_FECHAALTA = ? WHERE PRODUCTO.PRODUCTO_ID = ?', [productDate, producto_id]);

        // req.flash('success', 'Producto Eliminado');
        res.redirect('/administrator/listPartner');//redireccionamos a la misma lista products
    },

    deleteGalleryPartner: async (req, res) => {
        const { producto_id } = req.params;

        var today = new Date();
        const productDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
        console.log(productDate);

        await pool.query('UPDATE PRODUCTO SET PRODUCTO_ESTADO = "ELIMINADO" WHERE PRODUCTO.PRODUCTO_ID = ?', [producto_id]);
        await pool.query('UPDATE PRODUCTO SET PRODUCTO_FECHABAJA = ? WHERE PRODUCTO.PRODUCTO_ID = ?', [productDate, producto_id]);

        // req.flash('success', 'Producto Eliminado');
        res.redirect('/administrator/listPartner');//redireccionamos a la misma lista products
    },

    createCategoryPost: async (req, res) => {

        const { CATEGORIA_NOMBRE, CATEGORIA_DESCRIPCION, CATEGORIA_ESTADO } = req.body;

        const newCategory = {
            CATEGORIA_NOMBRE,
            CATEGORIA_DESCRIPCION,
            CATEGORIA_ESTADO
        };

        newCategory.CATEGORIA_NOMBRE = newCategory.CATEGORIA_NOMBRE.toUpperCase();
        newCategory.CATEGORIA_DESCRIPCION = newCategory.CATEGORIA_DESCRIPCION.toUpperCase();
        newCategory.CATEGORIA_ESTADO = 'ACTIVO';

        console.log(newCategory);

        // await pool.query('INSERT INTO CATEGORIA set ?', [newCategory]);

        req.flash('success', 'Producto Agregado');//Almacenamos el mensaje en success
        res.redirect('/administrator');//redirecciona a la ruta products
    },

}