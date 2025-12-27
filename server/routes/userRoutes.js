const mongoose = require("mongoose");
const User = mongoose.model("users");

module.exports = (app) => {
    app.post("/api/v1/user/add", async (req, res) => {
    console.log("ADD NEW USER");
    const { name, email, subscriptionType} = req.body;

    try {
      const user = await User.findOne({ name });

      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      userFields = { name, email, subscriptionType };
      const response = await User.create(userFields);

      res.status(201).json({ message: "User added successfully", response });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  });
   app.get("/api/v1/user/get/:email", async (req, res) => {
    const email = req.params.email;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "User doesn't exist" });
      }

      res.status(201).json({ message: "Here is the user: ", user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get All User
    app.get("/api/v1/user/all/get", async (req, res) => {
    try {
      const users = await User.find();

      if (!users) {
        return res.status(400).json({ message: "There are no users." });
      }

      res.status(201).json({ message: "User: ", users });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
    });
     // Update User Info
  app.put("/api/v1/update/user/:id", async (req, res) => {
    const { id } = req.params;
    const { name, phone } = req.body;
    try {
      const response = await User.updateOne({ _id: id }, { name, phone });
      res.status(200).json({ message: "User updated successfully", response });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  });

  // Delete User
  app.delete("/api/v1/delete/user/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const response = await User.findByIdAndDelete(id);
      res.status(200).json({ message: "User deleted successfully", response });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  });
};