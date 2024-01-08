import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

//registrar usuario
export const register = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    //validamos email de usuario
    const userFound = await User.findOne({ email });
    if (userFound) {
      return res.status(400).json(["the email is already in use"]);
    }

    //se encripta la contraseña
    const passwordHash = await bcryptjs.hash(password, 10);

    //se crea un nuevo usuario
    const newUser = new User({
      username,
      email,
      password: passwordHash,
    });

    //se guarda
    const userSaved = await newUser.save();
    //se crea el token
    const token = await createAccessToken({ id: userSaved._id });
    res.cookie("token", token);
    res.json({
      id: userSaved.id,
      username: userSaved.username,
      email: userSaved.email,
      ceratedAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
//logear usuario
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    //buscamos el usuario con el email
    const userFound = await User.findOne({ email });
    // en caso de no encontrar el usuario
    if (!userFound) return res.status(400).json({ message: "User not found" });
    //comparamos las contrasseñas
    const isMatch = await bcryptjs.compare(password, userFound.password);
    //validamos si son ismatch es true
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    //se crea el token
    const token = await createAccessToken({ id: userFound._id });
    res.cookie("token", token);
    res.json({
      id: userFound.id,
      username: userFound.username,
      email: userFound.email,
      ceratedAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id);
  if (!userFound)
    return res.status(400).json({
      message: "User not found",
    });
  return res.json({
    id: userFound._id,
    username: userFound.username,
    email: userFound.email,
    ceratedAt: userFound.createdAt,
    updatedAt: userFound.updatedAt,
  });
  res.send("profile");
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, TOKEN_SECRET, async (err, user) => {
    if (err)
      return res.status(401).json({
        message: "Unauthorized",
      });

    const userFound = await User.findById(user.id);
    if (!userFound)
      return res.status(401).json({
        message: "Unauthorized",
      });
    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    });
  });
};
