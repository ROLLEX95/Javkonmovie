
// Langtian4d Backend - Login & Register System
// Simpan file ini sebagai 'server.js'
// Jalankan dengan: node server.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/langtian4d', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ Mongo Error:', err));

// User schema & model
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 },
  role: { type: String, default: 'user' } // 'user' or 'admin'
});
const User = mongoose.model('User', UserSchema);

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const exist = await User.findOne({ username });
    if (exist) return res.status(400).json({ msg: 'Username sudah terdaftar' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const newUser = new User({ username, password: hashed });

    await newUser.save();
    res.status(201).json({ msg: 'Registrasi berhasil' });
  } catch (err) {
    res.status(500).json({ msg: 'Terjadi kesalahan server' });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'Akun tidak ditemukan' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: 'Password salah' });

    const token = jwt.sign({ id: user._id, role: user.role }, 'secretkey', { expiresIn: '2h' });
    res.json({ token, username: user.username, role: user.role });
  } catch (err) {
    res.status(500).json({ msg: 'Terjadi kesalahan server' });
  }
});

// Port listen
app.listen(5000, () => {
  console.log('🚀 Server Langtian4d berjalan di http://localhost:5000');
});
