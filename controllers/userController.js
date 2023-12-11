const express = require("express");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const moment = require("moment");

exports.register = async (req, res) => {
    try {
      const userExists = await User.findOne({ email: req.body.email });
      if (userExists) {
        return res
          .status(200)
          .send({ message: "User already exists", success: false });
      }
      const password = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      req.body.password = hashedPassword;
      const newuser = new User(req.body);
      await newuser.save();
      res
        .status(200)
        .send({ message: "User created successfully", success: true });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ message: "Error creating user", success: false, error });
    }
  }

exports.login = async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res
          .status(200)
          .send({ message: "User does not exist", success: false });
      }
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return res
          .status(200)
          .send({ message: "Password is incorrect", success: false });
      } else {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });
        res
          .status(200)
          .send({ message: "Login successful", success: true, data: token });
      }
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ message: "Error logging in", success: false, error });
    }
  }

exports.registerAdmin = async (req, res) => {
    try {
      const adminExists = await User.findOne({ email: req.body.email });
      if (adminExists) {
        return res
          .status(200)
          .send({ message: "Admin already exists", success: false });
      }
      const password = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      req.body.password = hashedPassword;
      const newuser = new User(req.body);
      await newuser.save();
      res
        .status(200)
        .send({ message: "Admin created successfully", success: true });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ message: "Error creating admin", success: false, error });
    }
  }

exports.getUserInfoById = async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.body.userId });
      user.password = undefined;
      if (!user) {
        return res
          .status(200)
          .send({ message: "User does not exist", success: false });
      } else {
        res.status(200).send({
          success: true,
          data: user,
        });
      }
    } catch (error) {
      res
        .status(500)
        .send({ message: "Error getting user info", success: false, error });
    }
  }

exports.getAllUser = async (req, res) => {
    try {
      const users = await User.find({});
      res.status(200).send({
        message: "Users fetched successfully",
        success: true,
        data: users,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error applying Admin account",
        success: false,
        error,
      });
    }
  };