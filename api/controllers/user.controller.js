import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";

export const test = (req, res) => {
  res.json({ message: "API is working!" });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(
      errorHandler(403, "Non hai i permessi per aggiornare questo utente")
    );
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, "La password deve avere min. 6 caratteri"));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }

  if (req.body.username) {
    if (req.body.username.length < 5 || req.body.username.length > 20) {
      return next(errorHandler(400, "Username compreso tra 5 e 20 caratteri"));
    }
    if (req.body.username.includes(" ")) {
      return next(errorHandler(400, "Username non deve contenere spazi"));
    }
    // if (req.body.username !== req.body.username.toLowerCase()) {
    //   return next(errorHandler(400, "Username must be lowercase"));
    // }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "Username can only contain letters and numbers")
      );
    }

    try {
      const updateUser = await User.findByIdAndUpdate(
        req.params.userId,
        {
          $set: {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            profilePicture: req.body.profilePicture,
          },
        },
        { new: true }
      );
      const { password, ...rest } = updateUser._doc;
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(
      errorHandler(403, "Non hai i permessi per eliminare questo utente")
    );
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("Utente eliminato con successo!");
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been signed out");
  } catch (error) {
    next(error);
  }
};
