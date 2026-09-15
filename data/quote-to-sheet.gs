function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["When", "Name", "Phone", "Email", "Project", "Rooms", "Timing", "Sq ft", "Remnant", "Notes"]);
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
  MailApp.sendEmail({
    to: "Allstarseattle@gmail.com",
    subject: "Quote request from " + (data.name || "website"),
    body:
      "Name: " + (data.name || "") + "\n" +
      "Phone: " + (data.phone || "") + "\n" +
      "Email: " + (data.email || "") + "\n" +
      "Project: " + (data.projectType || "") + "\n" +
      "Rooms: " + (data.rooms || "") + "\n" +
      "Timing: " + (data.timing || "") + "\n" +
      "Sq ft: " + (data.sqft || "") + "\n" +
      "Notes: " + (data.notes || "")
  });
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
