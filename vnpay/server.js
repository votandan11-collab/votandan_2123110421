import express from "express";
import cors from "cors";
import "dotenv/config";
import { VNPay } from "vnpay";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ✅ Cấu hình VNPAY
const vnpay = new VNPay({
  tmnCode: process.env.VNP_TMN_CODE, // Mã website do VNPAY cấp
  secureSecret: process.env.VNP_HASH_SECRET, // Chuỗi bí mật do VNPAY cấp
  testMode: true, // true = sandbox (môi trường test)
});

// ✅ API tạo URL thanh toán
app.get("/payment", (req, res) => {
  try {
    // Lấy số tiền từ query, ví dụ: /payment?amount=500000
    let amount = Number(req.query.amount);

    // Kiểm tra hợp lệ
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Số tiền không hợp lệ" });
    }

    // Lấy IP client
    const ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      "127.0.0.1";

    // ✅ Tạo URL thanh toán
    const vnpUrl = vnpay.buildPaymentUrl({
      vnp_Amount: amount * 10, // VNPay yêu cầu số tiền * 100
      vnp_IpAddr: ipAddr,
      vnp_TxnRef: Date.now(), // Mã giao dịch duy nhất
      vnp_OrderInfo: `Thanh toan don hang #${Date.now()}`,
      vnp_ReturnUrl: `http://localhost:8081/PaymentScreen`, // Trang quay về sau thanh toán
    });

    console.log("✅ Payment URL:", vnpUrl);
    res.json({ url: vnpUrl });
  } catch (err) {
    console.error("❌ Lỗi khi tạo URL thanh toán:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ API kiểm tra kết quả trả về từ VNPay
app.get("/", (req, res) => {
  try {
    const query = req.query;
    const verified = vnpay.verifyReturnUrl(query);

    console.log("VNPay return query:", query);

    if (verified && query.vnp_ResponseCode === "00") {
      res.send("✅ Thanh toán thành công!");
    } else {
      res.send("❌ Thanh toán thất bại hoặc bị hủy!");
    }
  } catch (err) {
    console.error("❌ Lỗi khi xác minh kết quả:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 VNPay server running on http://localhost:${PORT}`);
});
