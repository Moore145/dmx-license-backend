import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = "dmx_license";

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

// Create a cached client to reuse across requests (recommended for Next.js API)
let cachedClient = null;

async function getClient() {
  if (cachedClient && cachedClient.isConnected()) {
    return cachedClient;
  }
  cachedClient = new MongoClient(uri);
  await cachedClient.connect();
  return cachedClient;
}

export async function POST(req) {
  try {
    const { licenseKey, deviceId } = await req.json();

    if (!licenseKey || !deviceId) {
      return new Response(JSON.stringify({ success: false, message: "Missing licenseKey or deviceId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = await getClient();
    const db = client.db(dbName);
    const licenses = db.collection("licenses");

    const license = await licenses.findOne({ key: licenseKey });

    if (!license) {
      return new Response(JSON.stringify({ success: false, message: "License not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (license.deviceId && license.deviceId !== deviceId) {
      return new Response(JSON.stringify({ success: false, message: "License already used on another device" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!license.deviceId) {
      await licenses.updateOne({ key: licenseKey }, { $set: { deviceId } });
    }

    return new Response(JSON.stringify({ success: true, message: "License valid" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET() {
  return new Response(JSON.stringify({ success: true, message: "GET request OK" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
