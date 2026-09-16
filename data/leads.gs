// All Star Surfaces — paste this into a Google Sheet:
// Extensions → Apps Script, then Deploy → New deployment → Web app
// Execute as: Me
// Who has access: Anyone
// Copy the Web app URL and send it so it can be saved on the website.

var TO = "Allstarseattle@gmail.com";

function doPost(e) {
  var data = {};
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    data = e.parameter || {};
  }
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Leads") || ss.insertSheet("Leads");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "When", "Name", "Phone", "Email", "Project", "Rooms", "Timing", "Sq ft", "Remnant", "Notes"
    ]);
    sheet.setFrozenRows(1);
  }
  sheet.appendRow([
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
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService.createTextOutput("All Star leads webhook is live");
}
