const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")
const { sendPasswordEmail } = require('../services/emailService');
const User = require('../models/user');

const userController = {
    async register(req, res)  {
        try {
          const { firstName, lastName, email, phoneNumber } = req.body;
      
          // Check if user exists
          let user = await User.findOne({ email });
          if (user) {
            return res.status(400).json({ message: 'User already exists' });
          }
      
          // Generate and send password via email
          const password = await sendPasswordEmail(email, firstName, lastName, phoneNumber);
          const hashedPassword = await bcrypt.hash(password, 10);
      
          user = new User({
            firstName,
            lastName,
            email,
            phoneNumber,
            password: hashedPassword
          });
      
          await user.save();
          res.status(201).json({ message: 'User registered successfully' });
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      },


    async login  (req, res){
        try {
          const { firstName, password } = req.body;
          const user = await User.findOne({ firstName });
      
          if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
          }
          const token = jwt.sign({firstName:user.firstName, lastName:user.lastName, email:user.email, id:user._id}, process.env.JWT_TOKEN_SECRET, {
            expiresIn: "1h",
          })
          res.json({ message: 'Login successful', token });
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      },

      async imageUpload(req, res){
        try {
          const userId= req.User.id;
          const updatePhoto = await User.updateOne({_id:userId}, {$set:{profilePicture:req.file.path}})
          res.json({ message: 'Profile picture uploaded successfully', imageUrl: req.file.path  });
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      },

      async getUserData(req, res){
        try {
          const userId = req.User.id;
    
          const user = await User.findById(userId).select('-password'); // Exclude password
          
          if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
      
          res.status(200).json(user);
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      },

}

module.exports = userController