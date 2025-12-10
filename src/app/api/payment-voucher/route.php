<?php
// Set headers for CORS and content type
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Ensure the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["success" => false, "error" => "Invalid request method."]);
    exit();
}

// Get the posted data
$data = json_decode(file_get_contents("php://input"));

// Basic validation
if (
    !isset($data->voucherDate) || 
    !isset($data->payeeName) || 
    !isset($data->paymentAccountId) ||
    !isset($data->totalAmount) ||
    !isset($data->lines) ||
    !is_array($data->lines)
) {
    http_response_code(400); // Bad Request
    echo json_encode(["success" => false, "error" => "Incomplete or invalid data provided."]);
    exit();
}

// --- Database Simulation ---
// In a real application, you would perform the following steps:
// 1. Start a database transaction.
// 2. Insert a new record into a `journal_vouchers` table.
//    - `date` = $data->voucherDate
//    - `narration` = "Payment to " . $data->payeeName
// 3. Get the ID of the newly created journal voucher.
// 4. For each line in `$data->lines`:
//    - Insert a record into `journal_entries` table for the debit side.
//    - `voucher_id` = new voucher ID
//    - `account_id` = $line->accountId
//    - `debit` = $line->amount
//    - `credit` = 0
// 5. Insert a final record into `journal_entries` for the credit side (the payment account).
//    - `voucher_id` = new voucher ID
//    - `account_id` = $data->paymentAccountId
//    - `debit` = 0
//    - `credit` = $data->totalAmount
// 6. Commit the transaction.
// 7. If any step fails, rollback the transaction and return an error.


// For this simulation, we'll just pretend it was successful and generate a fake ID.
$simulatedJournalVoucherId = "JV-" . rand(10000, 99999);

// Send a successful response
http_response_code(200);
echo json_encode([
    "success" => true,
    "journalVoucherId" => $simulatedJournalVoucherId
]);

?>
