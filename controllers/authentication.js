const pool = require('../database');

module.exports = {

    // createUserPage: async (req, res) => {
    //     res.render('auth/signup');
    // },

    createUserPost: async (req, res, cb) => { // Creamos nuevo usuario
        console.log(req.body);

        const { ROL_ID, PERSONA_NOMBRE, PERSONA_CORREO, PERSONA_CONTRASENA, PERSONA_ESTADO } = req.body;
        const rows = await pool.query('SELECT * FROM PERSONA WHERE PERSONA_CORREO = ?', [PERSONA_CORREO]);

        if (rows.length > 0) {
            // return cb(new Error('El correo ' + PERSONA_CORREO + ' ya existe'));
            req.flash('message', 'El correo ' + PERSONA_CORREO + ' ya existe');
            res.redirect('/');
        } else {
            const newUser = {
                ROL_ID,
                PERSONA_NOMBRE,
                PERSONA_CORREO,
                PERSONA_CONTRASENA,
                PERSONA_ESTADO,
            }

            newUser.ROL_ID = 3;
            newUser.PERSONA_NOMBRE = newUser.PERSONA_NOMBRE.toUpperCase();
            newUser.PERSONA_ESTADO = 'Activo';

            console.log(newUser);
            await pool.query('INSERT INTO PERSONA SET ?', [newUser]);
            req.flash('success', 'Cuenta creada con exito');

            res.redirect('/');
        }
    }
}