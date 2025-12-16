// controllers/transaksiController.js
const db = require('../config/database');

exports.createTransaction = async (req, res) => {
    const { user_id, items, paid_amount } = req.body;

    // Check jika keranjang kosong
    if (!items || items.length === 0) {
        return res.status(400).json({ error: "Keranjang kosong!" });
    }

    try {
        // 1. Hitumng jumlah harga
        let total_bill = 0;
        const products_to_buy = [];

        for (const item of items) {
            // Ambil harga dari database
            const [productData] = await db.query('SELECT * FROM produk WHERE id = ?', [item.id]);
            
            if (productData.length === 0) {
                return res.status(404).json({ error: `Produk ID ${item.id} tidak ditemukan` });
            }

            const product = productData[0];
            const subtotal = product.harga * item.qty;
            total_bill += subtotal;

            // Persiap data untuk dimasukkan ke detail_transaksi
            products_to_buy.push({
                id: product.id,
                price: product.harga,
                qty: item.qty,
                subtotal: subtotal
            });
        }

        // 2. Cek pembayaran
        if (paid_amount < total_bill) {
            return res.status(400).json({ 
                error: "Uang tidak cukup!", 
                total: total_bill, 
                kurang: total_bill - paid_amount 
            });
        }

        // 3. Masukakan ke transaksi
        const [resultHeader] = await db.query(
            'INSERT INTO transaksi (user_id, total_bayar, status_pembayaran) VALUES (?, ?, ?)',
            [user_id, total_bill, 'success']
        );
        const transaksiId = resultHeader.insertId;

        // 4. Tambahkan ke detail_transaksi
        for (const p of products_to_buy) {
            await db.query(
                'INSERT INTO detail_transaksi (transaksi_id, produk_id, jumlah, subtotal) VALUES (?, ?, ?, ?)',
                [transaksiId, p.id, p.qty, p.subtotal]
            );
        }

        // 5. Kirim response sukses
        res.json({
            success: true,
            message: "Transaksi Berhasil!",
            data: {
                transaksi_id: transaksiId,
                total_bayar: total_bill,
                kembalian: paid_amount - total_bill
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database Transaction Failed" });
    }
};