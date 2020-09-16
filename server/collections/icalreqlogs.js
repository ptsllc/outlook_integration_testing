// iCal Message Request Logs
const router = require("express").Router();
const db = require("../mssql");
const outlook = require("../outlook");

// url = /ical
router.get("/", function (req, res, next) {
  let params = [];
  let myQuery = `
      SELECT x.SEQNUM, ICALREQLOGID, X.UID, TYPE, DTCREATED, SENDTO, LOCATION, APPTDATE, STARTHOUR, STARTMIN, ENDHOUR, ENDMIN, MSGTEXT
      FROM ICALREQLOGS
      JOIN (SELECT COUNT(*) SEQNUM, UID FROM ICALREQLOGS GROUP BY UID) as X on ICALREQLOGS.UID = x.UID
      WHERE ICALREQLOGID IN (
          SELECT MAX(ICALREQLOGID) ICALREQLOGID FROM ICALREQLOGS GROUP BY UID
          EXCEPT
          SELECT ICALREQLOGID FROM ICALREQLOGS WHERE TYPE = 'CANCEL'
          )
      `;
  db.query(myQuery, params).then((data) => {
    res.json(data);
  });
});

// url = /ical/{id}
router.get("/:id", function (req, res, next) {
  let params = [];
  params.push(db.createParam("msgid", req.params.id));
  let myQuery = `
                SELECT *
                FROM ICALREQLOGS
                WHERE ICALREQLOGID = @msgid
                `;
  db.query(myQuery, params).then((data) => {
    res.json(data);
  });
});

// url = /ical
router.post("/", function (req, res, next) {
  let postData = req.body;

  let rightNow = new Date();
  let offset = rightNow.getTimezoneOffset();
  rightNow.setMinutes(rightNow.getMinutes() + offset);

  postData.UID = postData.UID || uuidv4();

  let params = [];
  params.push(db.createParam("UID", postData.UID));
  params.push(db.createParam("TYPE", postData.TYPE || "REQUEST"));
  params.push(db.createParam("DTCREATED", rightNow.toISOString()));
  params.push(db.createParam("SENDTO", postData.SENDTO));
  params.push(
    db.createParam("LOCATION", postData.LOCATION || "No Location Provided")
  );
  params.push(db.createParam("APPTDATE", postData.APPTDATE || rightNow));
  params.push(db.createParam("STARTHOUR", postData.STARTHOUR || 12));
  params.push(db.createParam("STARTMIN", postData.STARTMIN || 0));
  params.push(db.createParam("ENDHOUR", postData.ENDHOUR || 12));
  params.push(db.createParam("ENDMIN", postData.ENDMIN || 0));
  params.push(db.createParam("MSGTEXT", postData.MSGTEXT || ""));

  let myQuery = `
    Insert into ICALREQLOGS (UID,TYPE,DTCREATED,SENDTO,LOCATION,APPTDATE,STARTHOUR,STARTMIN,ENDHOUR,ENDMIN,MSGTEXT) 
    values (@UID,@TYPE,@DTCREATED,@SENDTO,@LOCATION,@APPTDATE,@STARTHOUR,@STARTMIN,@ENDHOUR,@ENDMIN,@MSGTEXT);
    `;

  console.log(postData);

  outlook.sendAppointment(postData).then(() => {
    db.query(myQuery, params).then(() => {
      let data = {
        data: "Success",
      };
      res.json(data);
    });
  });
});

// url = /ical
router.delete("/", function (req, res, next) {
  let params = [];
  let myQuery = `TRUNCATE TABLE ICALREQLOGS`;
  db.query(myQuery, params).then(() => {
    res.send("Success");
  });
});

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

//Required to work!!!!!
module.exports = router;
