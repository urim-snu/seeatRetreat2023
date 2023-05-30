import { GoogleSpreadsheet } from "google-spreadsheet";

const creds = require("../configs/seeat-2023-828f8e2d2be3.json");

export const shuttle_sheet = new GoogleSpreadsheet(
  process.env.MEMBER_SHEET_DOC_ID
);

const initializeGoogleSpreadsheet = async () => {
  await shuttle_sheet.useServiceAccountAuth(creds);

  await shuttle_sheet.loadInfo();

  return;
};

export const getShuttleData = async () => {
  // get all rows from the sheet
  await initializeGoogleSpreadsheet();

  const FORM_TYPE_COLUMN = "선택해 주세요.";
  const SHUTTLE_TYPE_COLUMN = "3. 이용할 노선을 선택해 주세요.";
  const NAME_COLUMN = "1. 이름을 입력해 주세요.";

  // get sheet by its name
  const sheet = shuttle_sheet.sheetsByTitle["셔틀 이용 신청 현황"];

  // get all rows from the sheet as an array, and filter by the column B
  const rows = await sheet.getRows();

  const shuttleData = rows.filter((row) => {
    return row[FORM_TYPE_COLUMN]?.includes("셔틀");
  });

  const notionData = shuttleData.map((row) => {
    // check row E
    const isGoing = row[SHUTTLE_TYPE_COLUMN].includes("출발");
    const isReturning = row[SHUTTLE_TYPE_COLUMN].includes("복귀");

    // three type (출발, 복귀, 출발/복귀)
    const type =
      isGoing && isReturning ? "출발/복귀" : isGoing ? "출발" : "복귀";

    const name = row[NAME_COLUMN];

    return {
      셔틀구분: {
        select: {
          name: type,
        },
      },
      신청자: {
        type: "rich_text",
        rich_text: [
          {
            type: "text",
            text: { content: name },
          },
        ],
      },
    };
  });

  return notionData;
};
