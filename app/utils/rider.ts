import { json } from "@remix-run/node";
import { clearAllDataInDB, putDataIntoNotionDB } from "~/libs/notion.server";
import { getRiderData } from "~/libs/sheet.server";

export const fetchAllRiderData = async () => {
  const databaseId = process.env.NOTION_RIDER_DB_ID || "";

  // 노션 데이터 전부 날리기
  await clearAllDataInDB(databaseId);

  // 구글 스프레드시트 데이터 가져오기
  const notionData = await getRiderData();

  try {
    // put notionData elements into notion db, concurrently
    const putNotionDataPromises = notionData.map((properties) =>
      putDataIntoNotionDB(databaseId, properties)
    );
  } catch (e) {
    console.log(e);
    return json(
      {
        message:
          "라이더 데이터를 노션에 성공적으로 업데이트하지 못했습니다." + e,
      },
      {
        status: 500,
      }
    );
  }

  return json(
    {
      message: "라이더 데이터를 노션에 성공적으로 업데이트했습니다.",
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    }
  );
};
