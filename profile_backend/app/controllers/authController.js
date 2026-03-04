const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const authModel = require("../models/authModel");
const { authValidation, updateValidation } = require("../utils/schemaValidation");
const deleteFile = require("../utils/deleteImage");


const SALT = 10;

class AuthController {
  async register(req, res) {
    try {
      const authData = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        about: req.body.about,
        profile_image: req.file ? `uploads/${req.file.filename}` : null,
      };
      const { error, value } = authValidation.validate(authData);
      if (error) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          error: error.message,
        });
      }

      const exisutingUser = await authModel.findOne({ email: value.email });
      if (exisutingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists with this email",
        });
      }
      const hashedPassword = await bcrypt.hash(value.password, SALT);
      const newUser = new authModel({
        name: value.name,
        email: value.email,
        password: hashedPassword,
        about: value.about,
        profile_image: value.profile_image,
      });
      const result = await newUser.save();
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error registering user",
        error: error.message,
      });
    }
  }







  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }
      const user = await authModel.findOne({ email });
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid email",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Invalid password",
        });
      }
      const token = jwt.sign(
        {
          id: user._id,
          name: user.name,
          email: user.email,
          profile_image: user.profile_image,
          about: user.about,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1d" },
      );
      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          profile_image: user.profile_image,
          about: user.about,
        },
        token: token,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error logging in",
        error: error.message,
      });
    }
  }








  async update(req, res) {
    try {
      const id = req.params.id;

      const updateData = {};
      if (req.body.name) updateData.name = req.body.name;
      if (req.body.email) updateData.email = req.body.email;
      if (req.body.password) updateData.password = req.body.password;
      if (req.body.about !== undefined) updateData.about = req.body.about;
      const user = await authModel.findById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      if (req.file) {
        if (user.profile_image) {
          const oldImagePath = path.join(__dirname, "../../", user.profile_image);
          deleteFile(oldImagePath);
        }
        updateData.profile_image = `uploads/${req.file.filename}`;
      } else if (req.body.profile_image) {
        updateData.profile_image = req.body.profile_image;
      }

      const { error, value } = updateValidation.validate(updateData);

      if (error) {
        const messages = error.details.map((err) => err.message);
        if (req.file) {
          const uploadedFile = path.join(__dirname, "../../uploads", req.file.filename);
          deleteFile(uploadedFile);
        }

        return res.status(400).json({
          success: false,
          message: messages,
        });
      }
      if (value.password) {
        value.password = await bcrypt.hash(value.password, SALT);
      }
      const updatedUser = await authModel.findByIdAndUpdate(id, value, {
        new: true,
      });

      const responseUser = {
        name: updatedUser.name,
        email: updatedUser.email,
        profile_image: updatedUser.profile_image,
        about: updatedUser.about,
        _id: updatedUser._id,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      };

      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: responseUser,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Error updating user",
        error: error.message,
      });
    }
  }





  async delete(req, res) {
    try {
      const id = req.params.id;
      const data = await authModel.findByIdAndDelete(id);
      if (!data) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      if (data && data.profile_image) {
        const imagePath = data.profile_image;
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      return res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error deleting user",
        error: error.message,
      });
    }
  }









  

  async getUser(req, res) {
    try {
      res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: req.user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving users",
        error: error.message,
      });
    }
  }
}

module.exports = new AuthController();
