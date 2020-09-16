const { smtp_config, emailFrom } = require("./appConfig");
const nodemailer = require("nodemailer");
const ics = require("ics");

const transporter = nodemailer.createTransport(smtp_config);

async function sendAppointment(msg) {
  let apptDate = new Date(msg.APPTDATE);
  let offset = apptDate.getTimezoneOffset();
  apptDate.setMinutes(apptDate.getMinutes() + offset);

  const event = {
    startInputType: "local",
    startOutputType: "utc",
    start: [
      apptDate.getFullYear(),
      apptDate.getMonth() + 1,
      apptDate.getDate(),
      msg.STARTHOUR,
      msg.STARTMIN,
    ],
    end: [
      apptDate.getFullYear(),
      apptDate.getMonth() + 1,
      apptDate.getDate(),
      msg.ENDHOUR,
      msg.ENDMIN,
    ],
    uid: msg.UID,
    productId: "PTSLLC_Emailer",
    location: msg.LOCATION,
    title: "Mock Appointment",
    method: msg.TYPE,
    sequence: msg.SEQNUM + 1 || 1,
  };

  let icscontent = "";
  ics.createEvent(event, (error, value) => {
    if (error) {
      console.log(error);
      return;
    }
    icscontent = value;
  });

  let newMailMsg = {
    from: emailFrom,
    to: msg.SENDTO,
    subject: "Appointment Test Message",
    html: msg.MSGTEXT,
    icalEvent: {
      method: msg.TYPE,
      content: icscontent,
    },
  };

  //console.log(newMailMsg);

  await transporter.sendMail(newMailMsg);

  return;
}

module.exports = {
  sendAppointment,
};
