const https = require('https');

exports.sendOTP = (phone) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ to: phone });

    const options = {
      hostname: 'console.melipayamak.com',
      port: 443,
      path: '/api/send/otp/${process.env.MELI_API_KEY}',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length 
      }
    };

    const req = https.request(options, res => {
      let body = '';

      res.on('data', chunk => { body += chunk; });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          console.log('📩 SMS API full response:', parsed);

          if (parsed.status && parsed.status.includes('ارسال موفق بود') && parsed.code) {
            resolve(parsed.code);
          } else {
            reject({
              message: parsed.status || 'خطا در ارسال OTP',
              message_en: 'Failed to send OTP'
            });
          }
        } catch (err) {
          console.error('JSON parse error:', err, body);
          reject({
            message: 'پاسخ نامعتبر از سرویس پیامک',
            message_en: 'Invalid response from SMS service'
          });
        }
      });
    });

    req.on('error', err => {
      console.error('❌ HTTPS request error:', err);
      reject({
        message: 'خطای ارتباط با سرویس پیامک',
        message_en: 'Error connecting to SMS service'
      });
    });

    req.write(data);
    req.end();
  });
};
