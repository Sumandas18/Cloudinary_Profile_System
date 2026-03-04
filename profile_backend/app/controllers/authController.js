const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

const authModel = require("../models/authModel");
const authValidation = require("../utils/schemaValidation");

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
      const hashedPassword = await bycrypt.hash(value.password, SALT);
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

      const isMatch = await bycrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Invalid password",
        });
      }
      const token = jwt.sign(
        {
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
      const updateData = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        about: req.body.about,
      };

      if (req.file) {
        const user = await authModel.findById(id);
        if (user && user.profile_image) {
          const imagePath = user.profile_image;
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }
        updateData.profile_image = `uploads/${req.file.filename}`;
      }
      const data = await authModel.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      if (!data) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating user",
        error: error.message,
      });
    }
  }






  async delete(req, res){
    try {
        const id = req.params.id;
        const data = await authModel.findByIdAndDelete(id);
        if(!data){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        if(data && data.profile_image){
          const imagePath = data.profile_image;
          if(fs.existsSync(imagePath)){
            fs.unlinkSync(imagePath);
          }
        }
        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting user",
            error: error.message
        })  
    }
  }




  async getUser(req,res){
    try {
      res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: req.user
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving users",
        error: error.message
      })
    }
  }
}

module.exports = new AuthController();
