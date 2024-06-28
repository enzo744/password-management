import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const create = async (req, res, next) => {

  if (!req.user.isAdmin) {
    return next(errorHandler(403, "Non hai i permessi per creare il post"));
  }
  if (!req.body.title) {
    return next(errorHandler(400, "Il campo title e' obbligatorio ed univoco"));
  }
//   const password = req.body.password;
//   const hashedPassword = bcryptjs.hashSync(password, 10);
//   password:hashedPassword;

  const slug = req.body.title
    .split(" ")
    .join("-") 
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");

  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};
