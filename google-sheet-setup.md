# Connect the contact form to a Google Sheet

The enquiry form already collects everything and POSTs it to a Google Apps Script
Web App. You just need to create that Web App (free, ~5 minutes) and paste its URL
into the site. **I can't do this step for you — it needs your own Google account.**

## 1. Create the sheet
1. Go to <https://sheets.google.com> and create a new blank spreadsheet.
2. Name it e.g. **Himherbal Enquiries**.

## 2. Add the script
1. In the sheet, menu **Extensions → Apps Script**.
2. Delete whatever is there and paste this:

```javascript
// Every enquiry is saved to the sheet AND emailed here:
var RECIPIENT = "himherbalhealthcare@gmail.com";

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(30000);
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    var p = (e && e.parameter) ? e.parameter : {};

    // Write the header row once
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp","Name","Company","Email","Phone","Location","Requirement","Message","Page"]);
    }

    var when = new Date();
    sheet.appendRow([
      when,
      p.name || "",
      p.company || "",
      p.email || "",
      p.phone || "",
      p.location || "",
      p.requirement || "",
      p.message || "",
      p.page || ""
    ]);

    // Email a copy of the enquiry to Him Herbal
    try {
      MailApp.sendEmail({
        to: RECIPIENT,
        replyTo: p.email || RECIPIENT,          // reply goes straight to the customer
        subject: "New website enquiry" + (p.name ? " — " + p.name : ""),
        body:
          "New enquiry from the Him Herbal website:\n\n" +
          "Name:        " + (p.name || "-") + "\n" +
          "Company:     " + (p.company || "-") + "\n" +
          "Email:       " + (p.email || "-") + "\n" +
          "Phone:       " + (p.phone || "-") + "\n" +
          "Location:    " + (p.location || "-") + "\n" +
          "Requirement: " + (p.requirement || "-") + "\n" +
          "Message:     " + (p.message || "-") + "\n\n" +
          "Received: " + when + "\n" +
          "Page:     " + (p.page || "-")
      });
    } catch (mailErr) {
      // Row is already saved; don't fail the request if the daily email quota is hit.
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

3. Click **Save** (disk icon).

## 3. Deploy it
1. Top-right **Deploy → New deployment**.
2. Click the gear ⚙ next to "Select type" → **Web app**.
3. Set:
   - **Description**: Himherbal enquiries
   - **Execute as**: *Me*
   - **Who has access**: **Anyone**  ← important, so the website can post to it
4. **Deploy** → authorise when prompted (choose your account → Advanced → Go to project → Allow).
5. Copy the **Web app URL** — it looks like
   `https://script.google.com/macros/s/AKfycb....../exec`

## 4. Paste the URL into the site
Open **`js/main.js`**, find this line near the contact-form code:

```javascript
const SHEET_ENDPOINT = ""; // e.g. "https://script.google.com/macros/s/AKfycb.../exec"
```

Put your URL between the quotes:

```javascript
const SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfycb....../exec";
```

Save, redeploy the site to Netlify, and submit a test enquiry — a new row should
appear in your sheet within a couple of seconds.

## Notes
- Until the URL is filled in, the form still works and shows the confirmation message;
  it just doesn't store anything yet.
- The request is sent `no-cors`, so the browser never sees the script's response — that's
  expected and fine for a lead form.
- **Email alerts are already built in** — every enquiry is emailed to
  `himherbalhealthcare@gmail.com` (change `RECIPIENT` at the top of the script to send
  elsewhere; use a comma-separated string for multiple recipients). The first time you
  submit, Google will ask you to authorise the "send email as you" permission.
- Free Gmail accounts can send ~100 of these emails/day — far more than enough for enquiries.
