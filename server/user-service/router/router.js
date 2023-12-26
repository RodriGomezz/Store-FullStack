import express from "express";
const router = express.Router();
import {
  loginCtrl,
  protect,
  signupCtrl,
  forgotPassword,
  resetPassword,
} from "../controller/authController.js";
import {
  product,
  productAutocomplete,
  productPagination,
  item,
  category,
  buyItems,
} from "../controller/productsController.js";

router.post("/login", protect, loginCtrl);

router.post("/signup", signupCtrl);

router.get("/products", product);

router.get("/productsAutocomplete", productAutocomplete);

router.get("/productsPagination", productPagination);

router.get("/productsCategory", category);

router.post("/selectedProductUrl", item);

router.post("/buyItems", buyItems);

router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword/:token", resetPassword);

export default router;
