// All Star Surfaces — quote leads
// Paste into Extensions → Apps Script, Save, then:
// 1. Run testLead once (click Run). Approve permissions.
// 2. Deploy → New deployment → Web app
//    Execute as: Me     Who has access: Anyone
// 3. Copy the URL and send it so the website can use it.
//
// Do not click Run on doPost — that is only for real website quotes.

var TO = "Allstarseattle@gmail.com";

function doPost(e) {
  var data = readLead(e);
  saveLead(data);
  mailLead(data);
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService.createTextOutput("All Star leads webhook is live");
}

function testLead() {
  saveLead({
    name: "Test lead",
    phone: "(206) 799-9881",
    email: TO,
    projectType: "Setup test",
    rooms: "",
    timing: "",
    sqft: "",
    remnant: "",
    notes: "You can delete this row. Setup worked."
  });
  SpreadsheetApp.getUi() && SpreadsheetApp.getUi();
}

function readLead(e) {
  if (!e) return {};
  if (e.postData && e.postData.contents) {
    try { return JSON.parse(e.postData.contents) || {}; } catch (err) {}
  }
  return e.parameter || {};
}

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Leads") || ss.insertSheet("Leads");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["When", "Name", "Phone", "Email", "Project", "Rooms", "Timing", "Sq ft", "Remnant", "Notes"]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function saveLead(data) {
  data = data || {};
  sheet_().appendRow([
    data.at || new Date(),
    data.name || "",
    data.phone || "",
    data.email || "",
    data.projectType || "",
    data.rooms || "",
    data.timing || "",
    data.sqft || "",
    data.remnant || "",
    data.notes || ""
  ]);
}

function mailLead(data) {
  data = data || {};
  var body =
    "New website quote\n\n" +
    "Name: " + (data.name || "") + "\n" +
    "Phone: " + (data.phone || "") + "\n" +
    "Email: " + (data.email || "") + "\n" +
    "Project: " + (data.projectType || "") + "\n" +
    "Rooms: " + (data.rooms || "") + "\n" +
    "Timing: " + (data.timing || "") + "\n" +
    "Sq ft: " + (data.sqft || "") + "\n" +
    "Remnant: " + (data.remnant || "") + "\n\n" +
    (data.notes || "");
  MailApp.sendEmail({
    to: TO,
    replyTo: data.email || TO,
    subject: "Quote request from " + (data.name || "website"),
    body: body
  });
}
