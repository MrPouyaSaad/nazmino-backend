const https = require('https');

exports.sendOTP = (phone) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ to: phone });

    const options = {
      hostname: 'console.melipayamak.com',
      port: 443,
      path: '/api/send/otp/4368aa61f1ee4edb8fb44f569d626e16', // ← لینک اختصاصی‌ات
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, res => {
      let body = '';

      res.on('data', d => {
        body += d;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode === 200 && parsed.code) {
            resolve(parsed.code);
          } else {
            reject(parsed.status || 'خطا در دریافت کد OTP');
          }
        } catch (e) {
          reject('پاسخ نامعتبر از سرویس پیامک');
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
};
