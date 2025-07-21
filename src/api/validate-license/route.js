import { NextResponse } from "next/server";

// Replace this with your real license storage (e.g. database or hardcoded list)
const VALID_LICENSES = {
  "ABC123": "user1",
  "XYZ456": "user2",
  "DMX789": "user3"
};

export async function POST(req) {
  try {
    const { licenseKey, deviceId } = await req.json();

    if (!licenseKey || !deviceId) {
      return NextResponse.json(
        { success: false, message: "Missing licenseKey or deviceId" },
        { status: 400 }
      );
    }

    if (!VALID_LICENSES[licenseKey]) {
      return NextResponse.json(
        { success: false, message: "Invalid license key" },
        { status: 403 }
      );
    }

    // Optionally: bind device ID (for now, we skip DB check and assume valid)
    return NextResponse.json(
      { success: true, message: "License valid for this device" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal error", error: error.message },
      { status: 500 }
    );
  }
}

// Optional GET handler for testing
export async function GET() {
  return NextResponse.json({ success: true, message: "GET request OK" });
}
