import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME;
  const token = process.env.AIRTABLE_TOKEN;

  if (!baseId || !tableName || !token) {
    return NextResponse.json(
      { error: "Missing Airtable environment variables" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();

    const { name, email, phone, business, message, budget, timeline } = body;

    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(
      tableName
    )}`;

    const airtableRes = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              Name: name,
              Email: email,
              Phone: phone,
              "Business name / website": business,
              Message: message,
              "Rough budget / scope": budget,
              Timeline: timeline,
              // Created: new Date().toISOString(), // ❌ remove this
            },
          },
        ],
      }),
    });

    if (!airtableRes.ok) {
      const text = await airtableRes.text();
      console.error("Airtable error:", airtableRes.status, text);

      return NextResponse.json(
        { error: "Airtable failed", details: text },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API route error:", err);
    return NextResponse.json(
      { error: "Server error", details: String(err) },
      { status: 500 }
    );
  }
}
