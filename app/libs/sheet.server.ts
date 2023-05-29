import { GoogleSpreadsheet } from "google-spreadsheet";

const initializeGoogleSpreadsheet = async () => {
  const creds = require("../configs/seeat-2023-828f8e2d2be3.json");

  const doc = new GoogleSpreadsheet(process.env.MEMBER_SHEET_DOC_ID);

  await doc.useServiceAccountAuth(creds);

  await doc.loadInfo();

  return doc;
};

initializeGoogleSpreadsheet().then((doc) => {
  console.log(doc.title);
});
