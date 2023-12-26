import products from "../models/products.js";
import itemsBought from "../models/itemsBought.js";
let countElements = 0;

export const product = async (req, res) => {
  countElements = await products.countDocuments();
  const page = req.query.page;
  const product = await products.find().skip().limit(page);
  return res.status(200).json({ product, countElements });
};

export const editDataBaseProduct = async (req, res) => {
  const {
    _id,
    title,
    description,
    price,
    image1,
    image2,
    image3,
    rating,
    category,
    active,
  } = req.body;
  await products.updateMany(
    {
      _id: _id,
    },
    {
      $set: {
        title: title,
        description: description,
        price: price,
        image1: image1,
        image2: image2,
        image3: image3,
        rating: rating,
        category: category,
        active: active,
      },
    }
  );
};

export const disableItem = async (req, res) => {
  const { _id, active } = req.body;
  await products.updateOne(
    { _id: _id },
    {
      $set: {
        active: active,
      },
    }
  );
};

export const deleteItem = async (req, res) => {
  const { item } = req.body;
  await products.deleteOne({ id: item });
};

export const addProduct = async (req, res) => {
  const {
    title,
    description,
    price,
    image1,
    image2,
    image3,
    rating,
    category,
    active,
  } = req.body;
  const countItems = await products.countDocuments({});

  products.insertMany({
    id: countItems + 1,
    title: title,
    description: description,
    price: price,
    image1: image1,
    image2: image2,
    image3: image3,
    rating: rating,
    category: category,
    active: active,
  });
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

export const boughtItems = async (req, res) => {
  const boughtItems = await itemsBought.find({});
  return res.status(200).json({ boughtItems });
};
