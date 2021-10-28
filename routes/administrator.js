const express = require('express');
const router = express.Router();

const { isAdmin } = require('../lib/auth');

const {
    getAllProducts,

    createImagePage,
    createImagePost,
    editImagePage,
    editImagePost,
    deleteImage,

    createVideoPage,
    createVideoPost,
    editVideoPage,
    editVideoPost,
    deleteVideo,

    getAllPartners,

    activePartnerGet,
    activePartnerSearch,
    activePartnerPost,

    getAllGalleryPartner,
    addGalleryPartner,
    deleteGalleryPartner,

    createCategoryPost
} = require('../controllers/administrator');

router.get('/', isAdmin, getAllProducts);

router.get('/addImage', isAdmin, createImagePage);
router.post('/addImage', isAdmin, createImagePost);
router.get('/editImage/:producto_id', isAdmin, editImagePage);
router.post('/editImage/:producto_id', isAdmin, editImagePost);
router.get('/deleteImage/:producto_id', isAdmin, deleteImage,
);

router.get('/addVideo', isAdmin, createVideoPage);
router.post('/addVideo', isAdmin, createVideoPost);
router.get('/editVideo/:producto_id', isAdmin, editVideoPage);
router.post('/editVideo/:producto_id', isAdmin, editVideoPost);
router.get('/deleteVideo/:producto_id', isAdmin, deleteVideo);

router.get('/listPartner', isAdmin, getAllPartners);//Listamos a todos los partners

router.get('/addPartner', isAdmin, activePartnerGet); //Obtenemos la pagina de Partners
router.get('/addPartner/search', isAdmin, activePartnerSearch); //Buscar usuarios por su correo
router.get('/activePartner/:id', isAdmin, activePartnerPost); //Activamos partners de la aplicacion web

router.get('/galleryPartner/:id', isAdmin, getAllGalleryPartner);//Obtenemos la galleria del usuario seleccionado
router.get('/addGalleryPartner/:producto_id', isAdmin, addGalleryPartner);
router.get('/deleteGalleryPartner/:producto_id', isAdmin, deleteGalleryPartner);

router.post('/addCategory', isAdmin, createCategoryPost);

module.exports = router;