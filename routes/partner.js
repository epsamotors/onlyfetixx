const express = require('express');
const router = express.Router();

const { isPartner } = require('../lib/auth');

const multer = require('multer');
const upload = multer({ dest: 'public/img/uploads/' })
const { v4: uuidv4 } = require('uuid');

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

    // getAllProductsPartner,
    // addPartner,
    // deletePartner,

    createImageGalleryPost,
    updateImageGalleryPost,
    deleteImageGalleryGet,

    createVideoGalleryPost,
    updateVideoGalleryPost,
    deleteVideoGalleryGet

} = require('../controllers/partner');

//---------------------------------------------------------------
// Enlistar Galleria
//---------------------------------------------------------------
router.get('/', isPartner, getAllProducts);
//---------------------------------------------------------------
// Portada de Imagenes
//---------------------------------------------------------------
router.get('/addImage', isPartner, createImagePage);
router.post('/addImage', isPartner, createImagePost);
router.get('/editImage/:producto_id', isPartner, editImagePage);
router.post('/editImage/:producto_id', isPartner, editImagePost);
router.get('/deleteImage/:producto_id', isPartner, deleteImage,);

router.post('/addImageGallery', isPartner, createImageGalleryPost);
router.post('/editImageGallery/:galeria_id', isPartner, updateImageGalleryPost);
router.get('/deleteImageaGallery/:galeria_id', isPartner, deleteImageGalleryGet);
//---------------------------------------------------------------
// Portada de videos
//---------------------------------------------------------------
router.get('/addVideo', isPartner, createVideoPage);
router.post('/addVideo', isPartner, createVideoPost);
router.get('/editVideo/:producto_id', isPartner, editVideoPage);
router.post('/editVideo/:producto_id', isPartner, editVideoPost);
router.get('/deleteVideo/:producto_id', isPartner, deleteVideo);

router.post('/addVideoGallery', isPartner, createVideoGalleryPost);
router.post('/editVideoGallery/:galeria_id', isPartner, updateVideoGalleryPost);
router.get('/deleteVideoGallery/:galeria_id', isPartner, deleteVideoGalleryGet);
//---------------------------------------------------------------
// 
//---------------------------------------------------------------
// router.get('/listPartner', isPartner, getAllProductsPartner);
// router.get('/addPartner/:producto_id', isPartner, addPartner);
// router.get('/deletePartner/:producto_id', isPartner, deletePartner);

module.exports = router;