// netlify/functions/home.js
// Hiển thị hướng dẫn sử dụng API (HTML đẹp mắt)

exports.handler = async () => {
  const html = `
  <html lang="vi">
    <head>
      <meta charset="UTF-8" />
      <title>Roblox API - Hướng dẫn sử dụng</title>
      <style>
        body {
          background: #0d1117;
          color: #e6edf3;
          font-family: 'Segoe UI', sans-serif;
          padding: 40px;
          line-height: 1.6;
        }
        h1, h2 { color: #58a6ff; }
        code {
          background: #161b22;
          padding: 3px 6px;
          border-radius: 4px;
          color: #ffa657;
        }
        .block {
          background: #161b22;
          padding: 15px 20px;
          border-radius: 10px;
          margin-top: 10px;
        }
        a { color: #79c0ff; text-decoration: none; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <h1>🧠 Roblox Info API (Netlify)</h1>
      <p>Dưới đây là hướng dẫn sử dụng toàn bộ endpoint API của bạn.</p>

      <div class="block">
        <h2>1️⃣ /key</h2>
        <p><b>Chức năng:</b> Tạo key ngẫu nhiên có hiệu lực trong 24 giờ.</p>
        <p><b>Ví dụ:</b> <code>/key</code></p>
        <p><b>Kết quả:</b></p>
        <pre>{
  "key": "eyJpYXQiOjE3MzA0Mj...",
  "expires_at": "2025-11-02T00:00:00Z"
}</pre>
      </div>

      <div class="block">
        <h2>2️⃣ /roblox?username=&lt;tên người chơi&gt;</h2>
        <p><b>Chức năng:</b> Tra thông tin người chơi Roblox (mô tả, bạn bè, nhóm, trang phục đang mặc).</p>
        <p><b>Ví dụ:</b> <code>/roblox?username=MinhlosVipp</code></p>
        <p><b>Kết quả mẫu:</b></p>
        <pre>{
  "Name": "MinhlosVipp",
  "Username": "OsbornLauren5",
  "ID": "7559629944",
  "Friends": 23,
  "Followers": 0,
  "GroupsCount": 0,
  "Wearing": [
    {
      "name": "Cool Black Jacket",
      "type": "Shirt",
      "imageUrl": "https://tr.rbxcdn.com/xxx150x150.png"
    }
  ]
}</pre>
      </div>

      <div class="block">
        <h2>3️⃣ /home hoặc /</h2>
        <p>Trang hiện tại — hiển thị hướng dẫn chi tiết về API.</p>
      </div>

      <br/>
      <p>💡 <b>Mẹo:</b> Bạn có thể triển khai API này miễn phí trên <a href="https://www.netlify.com" target="_blank">Netlify</a> và dùng cho project web hoặc bot Discord!</p>
      <p>© 2025 Roblox API by <b>Bạn</b> 💙</p>
    </body>
  </html>
  `;

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/html" },
    body: html
  };
};
