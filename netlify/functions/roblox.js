// netlify/functions/roblox.js
// GET /roblox?username=someName
// Trả về thông tin user + trang phục đang mặc (chi tiết)

async function fetchJson(url, opts) {
  const r = await fetch(url, opts);
  if (!r.ok) return { ok: false, status: r.status, text: await r.text() };
  return { ok: true, json: await r.json() };
}

exports.handler = async (event) => {
  const qp = event.queryStringParameters || {};
  const username = qp.username || qp.u;
  if (!username) {
    return { statusCode: 400, body: JSON.stringify({ error: "Provide username query param" }) };
  }

  try {
    // 1️⃣ Lấy userId
    let userId = null, usernameResolved = null, displayName = null;
    const usersResp = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernames: [username] })
    });

    if (usersResp.ok) {
      const data = await usersResp.json();
      if (data && data.data && data.data.length > 0) {
        const u = data.data[0];
        userId = u.id;
        usernameResolved = u.name;
        displayName = u.displayName || "";
      }
    }

    if (!userId) {
      const fallback = await fetchJson(`https://api.roblox.com/users/get-by-username?username=${encodeURIComponent(username)}`);
      if (!fallback.ok || !fallback.json.Id)
        return { statusCode: 404, body: JSON.stringify({ error: "User not found" }) };
      userId = fallback.json.Id;
      usernameResolved = fallback.json.Username;
    }

    // 2️⃣ Thông tin cơ bản
    const profile = await fetchJson(`https://users.roblox.com/v1/users/${userId}`);
    const created = profile.ok ? profile.json.created : null;
    const description = profile.ok ? profile.json.description || "" : "";

    // 3️⃣ Bạn bè / Theo dõi
    const friendsResp = await fetchJson(`https://friends.roblox.com/v1/users/${userId}/friends/count`);
    const followersResp = await fetchJson(`https://friends.roblox.com/v1/users/${userId}/followers/count`);
    const friends = friendsResp.ok ? friendsResp.json.count : null;
    const followers = followersResp.ok ? followersResp.json.count : null;

    // 4️⃣ Nhóm
    const groupsResp = await fetchJson(`https://groups.roblox.com/v2/users/${userId}/groups/roles`);
    const groupsData = groupsResp.ok ? groupsResp.json.data || [] : [];

    // 5️⃣ Trang phục đang mặc
    const wearResp = await fetchJson(`https://avatar.roblox.com/v1/users/${userId}/currently-wearing`);
    let wearingAssets = [];
    if (wearResp.ok && wearResp.json.assetIds && wearResp.json.assetIds.length > 0) {
      const ids = wearResp.json.assetIds;
      const thumbUrl = `https://thumbnails.roblox.com/v1/assets?assetIds=${ids.join(",")}&size=150x150&format=Png&isCircular=false`;
      const thumbs = await fetchJson(thumbUrl);

      // lấy chi tiết từng item
      if (thumbs.ok) {
        wearingAssets = thumbs.json.data.map((item, i) => ({
          assetId: ids[i],
          name: item.name || `Asset ${ids[i]}`,
          type: item.assetType || "Unknown",
          imageUrl: item.imageUrl || null
        }));
      } else {
        wearingAssets = ids.map(id => ({ assetId: id }));
      }
    }

    // 6️⃣ Kết quả
    const out = {
      Name: displayName || usernameResolved,
      Username: usernameResolved,
      ID: String(userId),
      Verified: false,
      Link: `https://www.roblox.com/users/${userId}/profile`,
      Created: created,
      Desc: description,
      Friends: friends,
      Followers: followers,
      Visits: null,
      GroupsCount: groupsData.length,
      Groups: groupsData.map(g => ({
        id: g.group?.id || null,
        name: g.group?.name || null,
        role: g.role?.name || null
      })),
      Wearing: wearingAssets,
      WearingCount: wearingAssets.length
    };

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(out, null, 2)
    };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: "exception", detail: String(err) }) };
  }
};
