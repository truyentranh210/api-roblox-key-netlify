// netlify/functions/home.js
// GET /home (JSON hướng dẫn sử dụng API)

exports.handler = async () => {
  const data = {
    name: "Roblox Info API",
    author: "ZheeDevVn",
    version: "v1.0.0",
    description: "API hiển thị thông tin người chơi Roblox và sinh key 24h. Triển khai trên Netlify.",
    endpoints: [
      {
        path: "/key",
        method: "GET",
        purpose: "Tạo key ngẫu nhiên có hiệu lực trong 24 giờ.",
        example: "/key",
        response_example: {
          key: "eyJpYXQiOjE3MzA0Mjg5NjIsImV4cCI6MTczMDUxNTM2Miwicm5kIjoiZDQ3Zj...g",
          expires_at: "2025-11-02T00:00:00Z"
        }
      },
      {
        path: "/roblox?username=<tên_người_chơi>",
        method: "GET",
        purpose: "Trả thông tin người chơi Roblox, bao gồm tên, mô tả, bạn bè, nhóm, và trang phục đang mặc.",
        example: "/roblox?username=MinhlosVipp",
        response_example: {
          Name: "MinhlosVipp",
          Username: "OsbornLauren5",
          ID: "7559629944",
          Friends: 23,
          Followers: 0,
          GroupsCount: 0,
          WearingCount: 2,
          Wearing: [
            {
              name: "Cool Black Jacket",
              type: "Shirt",
              imageUrl: "https://tr.rbxcdn.com/example1.png"
            },
            {
              name: "Blue Jeans",
              type: "Pants",
              imageUrl: "https://tr.rbxcdn.com/example2.png"
            }
          ]
        }
      },
      {
        path: "/home",
        method: "GET",
        purpose: "Trả hướng dẫn sử dụng toàn bộ API dưới dạng JSON.",
        example: "/home"
      }
    ],
    usage: {
      base_url: "https://<tên_site>.netlify.app",
      note: "Bạn có thể thay <tên_site> bằng domain Netlify của mình, ví dụ: https://rbx-api-v1.netlify.app",
      tip: "Có thể dùng cho bot Discord, web app hoặc script để lấy thông tin Roblox dễ dàng."
    },
    last_update: new Date().toISOString()
  };

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data, null, 2)
  };
};
