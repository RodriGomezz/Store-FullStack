import express from "express";
const router = express.Router();
import {
  product,
  productPagination,
  editDataBaseProduct,
  addProduct,
  deleteItem,
  disableItem,
  boughtItems,
} from "../controller/productsController.js";
import { getUsers, deleteUser } from "../controller/usersController.js";

router.get("/adminProducts", product);

router.get("/productsPagination", productPagination);

router.put("/editDataBase", editDataBaseProduct);

router.put("/disableItem", disableItem);

router.put("/deleteItem", deleteItem);

router.post("/addProduct", addProduct);

router.get("/getBoughtItems", boughtItems);

router.get("/allUsers", getUsers);

router.post("/deleteUser", deleteUser);

export default router;
