import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = "dmx_license";

export async function POST(req) {
  try {
    const { licenseKey, deviceId } = await req.json();

    if (!licenseKey || !deviceId) {
      return new Response(JSON.stringify({ success: false, message: "Missing licenseKey or deviceId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await client.connect();
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
