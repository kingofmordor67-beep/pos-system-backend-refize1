const db = require('../config/database');

exports.getAllProducts = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM produk');
        res.json({
            success: true,
            message: "List Data Produk",
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};