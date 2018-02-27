// GLOBAL CONSTANTS
var CONTACTS_SS = "1m4H_Ghn89uotI2gXyLccbYf94SpXYNGFvjoSc6HAc4s";  // NEW
var CONTACTS_SHEET1 = "LigueSimple";
var CONTACTS_SHEET2 = "LigueDouble";

/***********************************************************************************
 * Special function that handles HTTP GET requests to the published web app.
 * @return {HtmlOutput} The HTML page to be served.
 **********************************************************************************/
function doGet(e) {

  var template = HtmlService.createTemplateFromFile('Page');

  // user Properties (pourquoi?)
  var userProperties = PropertiesService.getUserProperties();

  // default
  template.ligue = "Ligue de double";

  // Retrieve and process any URL parameters, as necessary.
  if (e.parameter.liste == "simple") {
    template.ligue = "Ligue de simple";
  } 
  else if (e.parameter.liste == "double") {
    template.ligue = "Ligue de double";
  }
  
  return template.evaluate()
       .setTitle('Afficher liste de membres')
       .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  
}


/*********************************************************************************
 * Get names in the single league
 * @list array of records including  "Group, Name and Availability"
 *********************************************************************************/
function getNames(passwordentered, ligue) {

  // Use data from spreadsheet.  Enter spreadsheet I here
  var ss    = SpreadsheetApp.openById(CONTACTS_SS);
  
  var SHEETNAME = CONTACTS_SHEET1;
  if (ligue == "Ligue de double") SHEETNAME = CONTACTS_SHEET2;
  var sheet = ss.getSheetByName(SHEETNAME);

  var data  = sheet.getRange(3,1,sheet.getLastRow()-1,6).getValues();

  // http://stackoverflow.com/questions/6490343/sorting-2-dimensional-javascript-array  NOTE: [x] is column to sort on
  //  Sort standard
  //  data.sort(function(a, b) { return ( a[0] < b[0] ? -1 : (a[0] > b[0] ? 1 : 0)); });

  //  Sort colonne 4 inverse, ensuite colonne 0 
  data.sort( function(a,b) { return (  a[4] == b[4]  ?  ( a[0] < b[0] ?  -1 
                                                                      : (a[0] > b[0] ? 1 
                                                                                     : 0) ) 
                                                     : (a[4] > b[4] ? -1 
                                                                    :  1 )    );  });

  // Get id and name in arrays  (column A = ID,  column B = name)
  var record = {};
  var list = [];
  var j = 0;
  for (var i = 0; i < data.length; i++) {

    if (data[i][1].substr(0,1) != " ") {
      record = {name: data[i][0], tel: data[i][1], cell: data[i][2], email: data[i][3], categ: data[i][4], niveau: data[i][5]};
      list[j] = record;
      j++;
    }
  }

  // Get password from spreadsheet and verify if it is correct
  // NOTE:  password must be in cell B1  
  var passwordinfile = sheet.getRange("B1:B1").getValue();  
  
  if (passwordentered == passwordinfile) {
    return list;
  } else {
    return null;
  }
  
}

function TESTgetNames() {
  var list = getNames("wilson");
  Logger.log(list);
}