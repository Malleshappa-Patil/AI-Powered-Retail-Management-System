const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

// The validation schema MUST include the email field.
const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(), // This line allows the email.
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});

// The registerUser function MUST handle the email field.
exports.registerUser = async (req, res) => {
  const { error } = userSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { username, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const [result] = await pool.query(
      'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [username, email, password_hash, 'viewer']
    );

    res.status(201).json({ id: result.insertId, username, email, role: 'viewer' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      if (err.message.includes('username')) {
        return res.status(409).json({ message: 'Username already exists.' });
      }
      if (err.message.includes('email')) {
        return res.status(409).json({ message: 'Email is already registered.' });
      }
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// // Login user and get token
// exports.loginUser = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
//     const user = rows[0];

//     // This is the real password check
//     if (user && (await bcrypt.compare(password, user.password_hash))) {
//       const token = jwt.sign(
//         { id: user.id, role: user.role },
//         process.env.JWT_SECRET,
//         { expiresIn: '1h' }
//       );
//       res.json({
//         id: user.id,
//         username: user.username,
//         role: user.role,
//         token,
//       });
//     } else {
//       res.status(401).json({ message: 'Invalid credentials' });
//     }
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };




// login user: In the terminal we can see which user is logedin or signed in 
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Login attempt:", username, password); // 👈 Debug log

    const [rows] = await pool.query(
      'SELECT * FROM users WHERE LOWER(username) = LOWER(?)',
      [username]
    );

    console.log("Query result:", rows); // 👈 Debug log
    const user = rows[0];

    if (!user) {
      console.log("User not found");
      return res.status(401).json({ message: 'User not found' });
    }

    console.log("Found user:", user.username, " => checking password");

    const validPassword = await bcrypt.compare(password, user.password_hash);
    console.log("Password valid?", validPassword);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing!");
      return res.status(500).json({ message: "JWT_SECRET is not configured" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      id: user.id,
      username: user.username,
      role: user.role,
      token,
    });

  } catch (err) {
    console.error("Login error stack:", err); // 👈 Full error log
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
