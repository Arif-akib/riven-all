const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// admin routes
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      isAdmin,
      status,
      addresses = [],
    } = req.body;

    if (!name || !email || !password || !phone || !isAdmin) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password,  role and phone are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email or phone already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔥 enforce default logic
    let hasDefault = false;

    const processedAddresses = addresses.map((addr) => {
      if (addr.isDefault) {
        if (hasDefault) {
          throw new Error("Only one default address allowed");
        }
        hasDefault = true;
      }
      return addr;
    });

    // if none default → make first default
    if (processedAddresses.length > 0 && !hasDefault) {
      processedAddresses[0].isDefault = true;
    }

    const user = await User.create({
      name,
      email,
      passwordHash: hashedPassword,
      phone,
      isAdmin,
      status,
      addresses: processedAddresses,
    });

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const { name, email, phone, password, status, isAdmin, addresses } =
      req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // email uniqueness
    if (email && email !== user.email) {
      const exists = await User.findOne({ email });
      if (exists) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    // phone uniqueness
    if (phone && phone !== user.phone) {
      const exists = await User.findOne({ phone });
      if (exists) {
        return res.status(400).json({ message: "Phone already in use" });
      }
      user.phone = phone;
    }

    if (name) user.name = name;
    if (status !== undefined) user.status = status;
    if (isAdmin) user.isAdmin = isAdmin;

    if (password) {
      user.passwordHash = await bcrypt.hash(password, 10);
    }

    // 🔥 address overwrite (admin-style)
    if (addresses) {
      let hasDefault = false;

      const processed = addresses.map((addr) => {
        if (addr.isDefault) {
          if (hasDefault) throw new Error("Only one default allowed");
          hasDefault = true;
        }
        return addr;
      });

      if (processed.length && !hasDefault) {
        processed[0].isDefault = true;
      }

      user.addresses = processed;
    }

    await user.save();

    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// user route 
exports.getAddresses = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(userId).select(
      "addresses phone",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      phone: user.phone || null,
      addresses: user.addresses || [],
    });
  } catch (error) {
    console.error("Get addresses error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch addresses",
    });
  }
};

exports.addAddress = async (req, res) => {
  const user = await User.findById(req.user.id);

  const newAddress = req.body;

  // if first address → auto default
  if (user.addresses.length === 0) {
    newAddress.isDefault = true;
  }

  // if user sets default → unset others
  if (newAddress.isDefault) {
    user.addresses.forEach(a => (a.isDefault = false));
  }

  user.addresses.push(newAddress);

  await user.save();

  res.json(user.addresses[user.addresses.length - 1]);
};

exports.updateAddress = async (req, res) => {
  const { addressId } = req.params;

  const user = await User.findById(req.user.id);

  const address = user.addresses.id(addressId);

  if (!address) {
    return res.status(404).json({ message: "Address not found" });
  }

  Object.assign(address, req.body);

  // if this becomes default → unset others
  if (req.body.isDefault) {
    user.addresses.forEach(a => {
      a.isDefault = a._id.toString() === addressId;
    });
  }

  await user.save();

  res.json(address);
};

exports.deleteAddress = async (req, res) => {
  const { addressId } = req.params;

  const user = await User.findById(req.user.id);

  const address = user.addresses.id(addressId);

  if (!address) {
    return res.status(404).json({ message: "Not found" });
  }

  const wasDefault = address.isDefault;

  address.remove();

  // if deleted default → assign first address as default
  if (wasDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }

  await user.save();

  res.json({ success: true });
};

exports.setDefaultAddress = async (req, res) => {
  const { addressId } = req.params;

  const user = await User.findById(req.user.id);

  user.addresses.forEach((a) => {
    a.isDefault = a._id.toString() === addressId;
  });

  await user.save();

  res.json({ success: true });
};

// public routes
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassowrd, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password and phone are required",
      });
    }

    if (password != confirmPassowrd) {
      return res.status(400).json({
        success: false,
        message: "password and confirm password didnot match",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email, phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email or phone number already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      passwordHash: hashedPassword,
    });

    const responseUser = {
      name: user.name,
      email: user.email,
      phone: user.phone,
    };

    res.status(201).json({
      success: true,
      data: responseUser,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+passwordHash");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 🔥 Create token
    const token = jwt.sign(
      {
        userID: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    // 🔥 Send token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // ❌ DO NOT send token to frontend
    res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role :user.isAdmin ? 'riven' : 'user'
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
