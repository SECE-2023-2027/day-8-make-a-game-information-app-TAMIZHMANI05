import { NextResponse } from "next/server";

let cachedToken = null;
let tokenExpiry = 0;

async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;
  const tokenRes = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    { method: "POST" }
  );
  const tokenData = await tokenRes.json();
  cachedToken = tokenData.access_token;
  tokenExpiry = Date.now() + (tokenData.expires_in - 60) * 1000; // buffer 1 min
  return cachedToken;
}

export async function GET() {
  const accessToken = await getAccessToken();
  const clientId = process.env.TWITCH_CLIENT_ID;
  const igdbRes = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "Client-ID": clientId,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "text/plain",
    },
    body: "fields name,cover.url,summary,rating; limit 12; sort rating desc;",
  });
  const games = await igdbRes.json();
  return NextResponse.json(games);
}
