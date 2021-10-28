const express = require('express');
const router = express.Router();

const { isLoggedIn } = require('../lib/auth');

const {
    getAllProducts,
    getSearchProducts,
    getCategoryProducts,
    getDetailProducts,
    addToCart,
    getCart,
    deleteInCart,
    deleteCart,
    buyCart,
    checkout,
    laterCart
} = require('../controllers/store');

router.get('/shop', isLoggedIn, getAllProducts);
router.get('/search', getSearchProducts);
router.get('/category', getCategoryProducts);
router.get('/detail/:producto_id', isLoggedIn, getDetailProducts);
router.post('/shop', isLoggedIn, addToCart);
router.get('/cart', isLoggedIn, getCart);
router.post('/cart', isLoggedIn, deleteInCart);
router.post('/cart/delete', isLoggedIn, deleteCart);
router.post('/cart/buy', isLoggedIn, buyCart);
router.post('/cart/checkout', isLoggedIn, checkout);
//router.post('/cartdetails', isLoggedIn,laterCart );

// router.get('/edit/:producto_id', isLoggedIn, editProductPage);
// router.post('/edit/:producto_id', isLoggedIn, validate(editProductsValidation), editProductPost);

module.exports = router;