import { json } from "@remix-run/node";
import { clearAllDataInDB, putDataIntoNotionDB } from "~/libs/notion.server";
import { getBasicData } from "~/libs/sheet.server";

export const fetchAllSeedGroupData = async () => {
  console.log("Fetching all shuttle data...");
  return null;
};

export const fetchAllBasicData = async () => {
  const databaseId = process.env.NOTION_BASIC_DB_ID || "";

  // 노션 데이터 전부 날리기
  await clearAllDataInDB(databaseId);

  // 구글 스프레드시트 데이터 가져오기
  const notionData = await getBasicData();

  try {
    // put notionData elements into notion db, wait for each put operation to complete
    for (const properties of notionData) {
      await putDataIntoNotionDB(databaseId, properties);
    }
  } catch (e) {
    console.log(e);
    return json(
      {
        message:
          "신청자 데이터를 노션에 성공적으로 업데이트하지 못했습니다." + e,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }

  // wait for all put operations to complete

  return json(
    {
      message: "신청자 데이터를 노션에 성공적으로 업데이트했습니다.",
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    }
  );
};
