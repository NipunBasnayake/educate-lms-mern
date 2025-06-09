const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Student = require("../models/Student");
const Instructor = require("../models/Instructor");
const SuperAdmin = require("../models/SuperAdmin");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  logger: true,
  debug: true,
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Transporter verification failed:", error);
    console.error("EMAIL_USER:", process.env.EMAIL_USER);
    console.error("EMAIL_PASS:", process.env.EMAIL_PASS ? "[REDACTED]" : undefined);
  } else {
    console.log("Transporter is ready to send emails");
  }
});

const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (!["Student", "Instructor", "SuperAdmin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    let user;
    if (role === "Student") {
      user = await Student.findOne({ email });
    } else if (role === "Instructor") {
      user = await Instructor.findOne({ email });
    } else if (role === "SuperAdmin") {
      user = await SuperAdmin.findOne({ email });
    }

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === "Student") {
      user = new Student({
        name,
        email,
        password: hashedPassword,
        profile: {
          phone: "",
          address: "",
          preferences: { notifications: true, language: "en" },
        },
      });
    } else if (role === "Instructor") {
      user = new Instructor({
        name,
        email,
        password: hashedPassword,
      });
    } else if (role === "SuperAdmin") {
      user = new SuperAdmin({
        name,
        email,
        password: hashedPassword,
        role: "superadmin",
      });
    }

    await user.save();

    const payload = { id: user._id, role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: user._id, name, email, role },
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    let user, role;
    user = await Student.findOne({ email });
    if (user) {
      role = "Student";
    } else {
      user = await Instructor.findOne({ email });
      if (user) {
        role = "Instructor";
      } else {
        user = await SuperAdmin.findOne({ email });
        if (user) {
          role = "SuperAdmin";
        }
      }
    }

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = { id: user._id, role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    let user;
    if (req.user.role === "Student") {
      user = await Student.findById(req.user.id).select("-password");
    } else if (req.user.role === "Instructor") {
      user = await Instructor.findById(req.user.id).select("-password");
    } else if (req.user.role === "SuperAdmin") {
      user = await SuperAdmin.findById(req.user.id).select("-password");
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    let user;
    user = await Student.findById(req.params.id).select("-password");
    if (!user) user = await Instructor.findById(req.params.id).select("-password");
    if (!user) user = await SuperAdmin.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, address, preferences } = req.body;
    let user;

    if (req.user.role === "Student") {
      user = await Student.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      user.name = name || user.name;
      user.email = email || user.email;
      if (phone || address || preferences) {
        user.profile = {
          phone: phone || user.profile.phone,
          address: address || user.profile.address,
          preferences: preferences || user.profile.preferences,
        };
      }
    } else if (req.user.role === "Instructor") {
      user = await Instructor.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      user.name = name || user.name;
      user.email = email || user.email;
    } else if (req.user.role === "SuperAdmin") {
      user = await SuperAdmin.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      user.name = name || user.name;
      user.email = email || user.email;
    }

    await user.save();
    res.json({
      message: "Profile updated successfully",
      user: user.toObject({ getters: true }),
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};

const updateUserById = async (req, res) => {
  try {
    const { name, email, phone, address, preferences } = req.body;
    let user;

    user = await Student.findById(req.params.id);
    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      if (phone || address || preferences) {
        user.profile = {
          phone: phone || user.profile.phone,
          address: address || user.profile.address,
          preferences: preferences || user.profile.preferences,
        };
      }
    } else {
      user = await Instructor.findById(req.params.id);
      if (user) {
        user.name = name || user.name;
        user.email = email || user.email;
      } else {
        user = await SuperAdmin.findById(req.params.id);
        if (user) {
          user.name = name || user.name;
          user.email = email || user.email;
        }
      }
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.save();
    res.json({
      message: "User updated successfully",
      user: user.toObject({ getters: true }),
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    let user;
    user = await Student.findByIdAndDelete(req.params.id);
    if (!user) user = await Instructor.findByIdAndDelete(req.params.id);
    if (!user) user = await SuperAdmin.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Missing email credentials in forgotPassword:", {
        EMAIL_USER: process.env.EMAIL_USER,
        EMAIL_PASS: process.env.EMAIL_PASS ? "[REDACTED]" : undefined,
      });
      return res.status(500).json({ message: "Email configuration missing" });
    }

    let user;
    user = await Student.findOne({ email });
    if (!user) user = await Instructor.findOne({ email });
    if (!user) user = await SuperAdmin.findOne({ email });

    if (!user) {
      console.log(`No user found for email: ${email}`);
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent generating new OTP if an active one exists
    if (user.resetPasswordExpires && Date.now() < user.resetPasswordExpires) {
      console.log(`Active OTP exists for ${email}, expires at ${user.resetPasswordExpires}`);
      return res.status(400).json({ message: "An active OTP already exists. Please wait before requesting a new one." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 600000; // 10 minutes

    try {
      await user.save();
      console.log(`OTP ${otp} saved for user ${email}, expires at ${user.resetPasswordExpires}`);
    } catch (saveError) {
      console.error(`Error saving OTP for ${email}:`, saveError);
      return res.status(500).json({ message: "Error saving OTP", error: saveError.message });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <h2>Password Reset Request</h2>
        <p>Dear User,</p>
        <p>You have requested to reset your password. Please use the following One-Time Password (OTP) to proceed:</p>
        <h3 style="color: #007bff;">${otp}</h3>
        <p>This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
        <p>Best regards,<br>EducateLMS Team</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`OTP email sent to ${email}`);
    } catch (emailError) {
      console.error(`Error sending OTP email to ${email}:`, emailError);
      return res.status(500).json({ message: "Error sending OTP email", error: emailError.message });
    }

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: "Error sending OTP", error: error.message });
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    let user;
    user = await Student.findOne({ email });
    if (!user) user = await Instructor.findOne({ email });
    if (!user) user = await SuperAdmin.findOne({ email });

    if (!user) {
      console.log(`No user found for email: ${email}`);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Stored OTP:", user.resetPasswordOTP);
    console.log("Provided OTP:", otp);
    console.log("OTP Expires:", user.resetPasswordExpires);
    console.log("Current Time:", Date.now());

    if (!user.resetPasswordOTP || !user.resetPasswordExpires) {
      console.log("No OTP found for user");
      return res.status(400).json({ message: "No OTP found. Please request a new one." });
    }

    if (String(user.resetPasswordOTP).trim() !== String(otp).trim()) {
      console.log("OTP mismatch");
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (Date.now() > user.resetPasswordExpires) {
      console.log("OTP expired");
      return res.status(400).json({ message: "Expired OTP" });
    }

    const payload = {
      id: user._id,
      role: user.role || (user instanceof Student ? "Student" : user instanceof Instructor ? "Instructor" : "SuperAdmin"),
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    // Clear OTP after successful verification
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    try {
      await user.save();
      console.log(`OTP cleared for user ${email}`);
    } catch (saveError) {
      console.error(`Error clearing OTP for ${email}:`, saveError);
      return res.status(500).json({ message: "Error clearing OTP", error: saveError.message });
    }

    res.json({ message: "OTP verified", resetToken: token });
  } catch (error) {
    console.error("Error in verifyOTP:", error);
    res.status(500).json({ message: "Error verifying OTP", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { password } = req.body;

  try {
    let user;
    if (req.user.role === "Student") {
      user = await Student.findById(req.user.id);
    } else if (req.user.role === "Instructor") {
      user = await Instructor.findById(req.user.id);
    } else if (req.user.role === "SuperAdmin") {
      user = await SuperAdmin.findById(req.user.id);
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password", error: error.message });
  }
};

const testEmail = async (req, res) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Missing email credentials in testEmail:", {
        EMAIL_USER: process.env.EMAIL_USER,
        EMAIL_PASS: process.env.EMAIL_PASS ? "[REDACTED]" : undefined,
      });
      return res.status(500).json({ message: "Email configuration missing" });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "test@example.com",
      subject: "Test Email",
      text: "This is a test email from Nodemailer.",
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Test email sent" });
  } catch (error) {
    console.error("Error in testEmail:", error);
    res.status(500).json({ message: "Error sending test email", error: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  getUserById,
  updateProfile,
  updateUserById,
  deleteUser,
  forgotPassword,
  verifyOTP,
  resetPassword,
  testEmail,
};