import { User } from "../db/index.js";
import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    let { token } = req.query;
    if (!token) token = req.body.token;
    if (!token)
      return res.status(404).json({
        message: "Not Authenticated User!",
      });

    const _id = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(_id);
    if (!user) {
      res.cookie("token", "");
      return res.status(404).json({
        message: "Not Authenticated User!",
      });
    }
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message,
    });
  }
};

export default isAuthenticated;
