const express = require('express')
const router = express.Router()

const authControllers = require('../controllers/auth')

// Menampilkan halaman signup
router.get('/signup', authControllers.signup_page)

// Menampilkan halaman login
router.get('/login', authControllers.login_page)

// Menambahkan user baru di database mongodb
router.post('/signup', authControllers.signup)

// Masuk user saat ini
router.post('/login', authControllers.login)

// Menampilkan halaman keluar
router.get('/logout', authControllers.logout_page)

module.exports = router