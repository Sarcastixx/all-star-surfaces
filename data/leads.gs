function doPost(e) {
  var data = {};
  if (e && e.postData && e.postData.contents) {
    try { data = JSON.parse(e.postData.contents); } catch (err) { data = {}; }
  } else if (e && e.parameter) {
    data = e.parameter;
  } else {
    data = {
      name: "Test lead",
      phone: "(206) 799-9881",
      email: "Allstarseattle@gmail.com",
      projectType: "Setup test",
      notes: "You can delete this row. Setup worked."
    };
  }
  writeRow_(data);
  sendMail_(data);
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService.createTextOutput("All Star leads webhook is live");
}

function testLead() {
  writeRow_({
    name: "Test lead",
    phone: "(206) 799-9881",
    email: "Allstarseattle@gmail.com",
    projectType: "Setup test",
    notes: "You can delete this row. Setup worked."
  });
}

function writeRow_(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Leads");
  if (!sheet) sheet = ss.insertSheet("Leads");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["When", "Name", "Phone", "Email", "Project", "Rooms", "Timing", "Sq ft", "Remnant", "Notes"]);
    sheet.setFrozenRows(1);
  }
  sheet.appendRow([
    new Date(),
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

function sendMail_(data) {
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
    to: "Allstarseattle@gmail.com",
    cc: "Phillipmiro123@gmail.com",
    replyTo: data.email || "Allstarseattle@gmail.com",
    subject: "Quote request from " + (data.name || "website"),
    body: body
  });
}
