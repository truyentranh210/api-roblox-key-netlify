// netlify/functions/roblox.js
// GET /roblox?username=someName
// Uses public Roblox endpoints. Node 18+ (global fetch available).

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
    // 1) Resolve username -> userId using bulk endpoint
    const usersResp = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernames: [username] })
    });

    if (!usersResp.ok) {
      // fallback to legacy endpoint
      const f = await fetchJson(`https://api.roblox.com/users/get-by-username?username=${encodeURIComponent(username)}`);
      if (!f.ok) return { statusCode: 404, body: JSON.stringify({ error: "User not found" }) };
      const u = f.json;
      if (!u || !u.Id) return { statusCode: 404, body: JSON.stringify({ error: "User not found" }) };
      userId = u.Id;
      usernameResolved = u.Username;
    } else {
      const data = await usersResp.json();
      if (!data || !data.data || data.data.length === 0) {
        return { statusCode: 404, body: JSON.stringify({ error: "User not found" }) };
      }
      const u = data.data[0];
      var userId = u.id;
      var usernameResolved = u.name || u.username;
      var displayName = u.displayName || "";
    }

    // 2) Profile details
    const profile = await fetchJson(`https://users.roblox.com/v1/users/${userId}`);
    let created = null, description = "";
    if (profile.ok) {
      created = profile.json.created || null;
      description = profile.json.description || "";
    }

    // 3) friends count
    const friendsResp = await fetchJson(`https://friends.roblox.com/v1/users/${userId}/friends/count`);
    const friends = friendsResp.ok ? friendsResp.json.count : null;

    // 4) followers count
    const followersResp = await fetchJson(`https://friends.roblox.com/v1/users/${userId}/followers/count`);
    const followers = followersResp.ok ? followersResp.json.count : null;

    // 5) groups
    const groupsResp = await fetchJson(`https://groups.roblox.com/v2/users/${userId}/groups/roles`);
    const groupsData = groupsResp.ok ? (groupsResp.json.data || []) : [];

    // 6) Build result (match screenshot fields)
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
      }))
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
