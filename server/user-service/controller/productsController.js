import products from "../models/products.js";
import itemsBought from "../models/ItemsBought.js";
let countElements = 0;

export const product = async (req, res) => {
  countElements = await products.countDocuments();
  const page = Number(req.query.page) + 1;
  const product = await products.find().skip().limit(page);
  return res.status(200).json({ product, countElements });
};

export const productAutocomplete = async (req, res) => {
  const { searchInput } = req.query;
  const regex = new RegExp(searchInput, "i");

  const product = await products.find({ title: { $regex: regex } });
  return res.status(200).json({ product });
};

export const productPagination = async (req, res) => {
  const LimitPage = Number(req.query.limit);
  const skipPage = req.query.page * LimitPage;
  const category = req.query.category;
  if (!category || category === "all") {
    const product = await products.find().skip(skipPage).limit(LimitPage);
    return res.status(200).json({ product, countElements });
  } else {
    const product = await products
      .find({ category: category })
      .skip(skipPage)
      .limit(LimitPage);
    return res.status(200).json({ product, countElements });
  }
};

export const item = async (req, res) => {
  const { item } = req.body;
  const itemSelected = await products.findOne({ id: Number(item) });
  return res.status(200).json(itemSelected);
};

export const category = async (req, res) => {
  const { category, limit } = req.query;
  const product = await products
    .find({ category: category })
    .skip()
    .limit(limit);

  countElements = await products.countDocuments({ category: category });
  return res.status(200).json({ product, countElements });
};

export const buyItems = async (req, res) => {
  const { userEmail, direction, items, totalPrice } = req.body;
  await itemsBought.insertMany({ userEmail, direction, items, totalPrice });
};
