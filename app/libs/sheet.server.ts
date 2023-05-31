import { GoogleSpreadsheet } from "google-spreadsheet";

const creds = require("../configs/seeat-2023-828f8e2d2be3.json");

export const shuttle_sheet = new GoogleSpreadsheet(
  process.env.SHUTTLE_SHEET_DOC_ID
);

export const basic_sheet = new GoogleSpreadsheet(
  process.env.MEMBER_SHEET_DOC_ID
);

export const getShuttleData = async () => {
  // get all rows from the sheet
  await shuttle_sheet.useServiceAccountAuth(creds);
  await shuttle_sheet.loadInfo();

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

export const getBasicData = async () => {
  await basic_sheet.useServiceAccountAuth(creds);
  await basic_sheet.loadInfo();

  const SHEET_NAME = "신청자 현황 관리_데이터 연동";
  const NAME_COLUMN = "1. 이름을 입력해 주세요.";
  const GENDER_COLUMN = "2. 성별을 선택해 주세요.";
  const TYPE_COLUMN = "4. 수양회 참석 형태를 체크해 주세요.";
  const SEEAT_GROUP_COLUMN = "씨앗모임";
  const ROOM_COLUMN = `숙소 배정 1 (스태프 배정)`;

  const sheet = basic_sheet.sheetsByTitle[SHEET_NAME];

  const rows = await sheet.getRows();

  console.log(`successfully fetched ${rows.length} rows from ${SHEET_NAME}`);

  const validRows = rows.filter((row) => {
    return row[NAME_COLUMN];
  });

  console.log(`successfully filtered ${validRows.length} rows`);

  const notionData = validRows.map((row) => {
    // get name, gender, type, seeat_group, room from each row
    const name = removeCommas(row[NAME_COLUMN] || "오류");

    const gender = row[GENDER_COLUMN]?.[0] || "오류";

    let type = "오류";
    if (row[TYPE_COLUMN]?.includes("전참")) {
      type = "전참";
    } else if (row[TYPE_COLUMN]?.includes("부분참")) {
      type = "부분참";
    }

    const seeatGroup = removeCommas(row[SEEAT_GROUP_COLUMN] || "오류");
    const room = removeCommas(row[ROOM_COLUMN] || "오류");

    return {
      신청자: {
        type: "rich_text",
        rich_text: [
          {
            type: "text",
            text: { content: name },
          },
        ],
      },
      성별: {
        select: {
          name: gender,
        },
      },
      구분: {
        select: {
          name: type,
        },
      },
      씨앗모임: {
        select: {
          name: seeatGroup,
        },
      },
      숙소정보: {
        select: {
          name: room,
        },
      },
    };
  });

  return notionData;
};

function removeCommas(str: string): string {
  return str.replace(/,/g, "");
}

export const getRiderData = async () => {
  // get all rows from the sheet
  await shuttle_sheet.useServiceAccountAuth(creds);
  await shuttle_sheet.loadInfo();

  const FORM_TYPE_COLUMN = "선택해 주세요.";
  const NAME_COLUMN = "1. 이름을 입력해주세요.";
  const DEPARTURE_COLUMN =
    "3. [수양관 도착] 경의중앙선 문산역  → 파주 솔수양관";
  const ARRIVAL_COLUMN = "4. [수양관 출발] 파주 솔수양관 → 경의중앙선 문산역";

  // get sheet by its name
  const sheet = shuttle_sheet.sheetsByTitle["셔틀 이용 신청 현황"];

  //   log header
  const headerValues = sheet.headerValues;
  console.log(headerValues);

  // get all rows from the sheet as an array, and filter by the column B
  const rows = await sheet.getRows();

  const shuttleData = rows.filter((row) => {
    return row[FORM_TYPE_COLUMN]?.includes("라이드");
  });

  const notionData = shuttleData.map((row) => {
    // check row E

    const name = row[NAME_COLUMN];
    const departureRoute = row[DEPARTURE_COLUMN] || "";
    const arrivalRoute = row[ARRIVAL_COLUMN] || "";

    return {
      출발노선: {
        type: "rich_text",
        rich_text: [
          {
            type: "text",
            text: { content: departureRoute },
          },
        ],
      },
      복귀노선: {
        type: "rich_text",
        rich_text: [
          {
            type: "text",
            text: { content: arrivalRoute },
          },
        ],
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
