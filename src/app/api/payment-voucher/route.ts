import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Basic validation
    if (
        !data.voucherDate || 
        !data.payeeName || 
        !data.paymentAccountId ||
        !data.totalAmount ||
        !data.lines ||
        !Array.isArray(data.lines)
    ) {
        return NextResponse.json({ success: false, error: "Incomplete or invalid data provided." }, { status: 400 });
    }

    // In a real app, you would interact with your database here.
    // For now, we simulate a successful operation.

    const simulatedJournalVoucherId = "JV-" + Math.floor(Math.random() * 90000) + 10000;

    return NextResponse.json({
        success: true,
        journalVoucherId: simulatedJournalVoucherId
    });

  } catch (error) {
    console.error("API Error:", error);
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
