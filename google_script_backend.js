function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  try {
    var data = JSON.parse(e.postData.contents);
    
    // Define headers if the sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp", "Name", "Roll No", "Grade", "Section", "Time Taken (s)", 
        "Tab Switches", "Time Outside Tab (s)",
        "Q1", "Q2", "Q3", "Q4", "Q5", "Q6", 
        "Q7", "Q8", "Q9", "Q10", "Q11", "Q12"
      ]);
    }
    
    // Append the row
    var row = [
      data.timestamp || new Date(),
      data.name || "",
      data.rollNo || "",
      data.grade || "",
      data.section || "",
      data.answers ? data.answers.timeTakenSeconds : "",
      data.answers && data.answers.tabSwitches !== undefined ? data.answers.tabSwitches : "0",
      data.answers && data.answers.timeOutsideTabSeconds !== undefined ? data.answers.timeOutsideTabSeconds : "0",
      data.answers && data.answers.Q1 ? data.answers.Q1 : "",
      data.answers && data.answers.Q2 ? data.answers.Q2 : "",
      data.answers && data.answers.Q3 ? data.answers.Q3 : "",
      data.answers && data.answers.Q4 ? data.answers.Q4 : "",
      data.answers && data.answers.Q5 ? data.answers.Q5 : "",
      data.answers && data.answers.Q6 ? data.answers.Q6 : "",
      data.answers && data.answers.Q7 ? data.answers.Q7 : "",
      data.answers && data.answers.Q8 ? data.answers.Q8 : "",
      data.answers && data.answers.Q9 ? data.answers.Q9 : "",
      data.answers && data.answers.Q10 ? data.answers.Q10 : "",
      data.answers && data.answers.Q11 ? data.answers.Q11 : "",
      data.answers && data.answers.Q12 ? data.answers.Q12 : ""
    ];
    
    sheet.appendRow(row);
    
    return ContentService.createTextOutput(JSON.stringify({"result": "success"}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({"result": "error", "error": error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
