import { json } from "@remix-run/node";
import {
  clearAllDataInDB,
  notion,
  putDataIntoNotionDB,
} from "~/libs/notion.server";
import { getShuttleData } from "~/libs/sheet.server";

export const fetchAllShuttleData = async () => {
  const databaseId = process.env.NOTION_SHUTTLE_DB_ID || "";

  // 노션 데이터 전부 날리기
  await clearAllDataInDB(databaseId);

  // 구글 스프레드시트 데이터 가져오기
  const notionData = await getShuttleData();

  // put notionData elements into notion db, concurrently
  const putNotionDataPromises = notionData.map((properties) =>
    putDataIntoNotionDB(databaseId, properties)
  );

  return json(
    {
      message: "셔틀 데이터를 노션에 성공적으로 업데이트했습니다.",
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    }
  );
};

// google sheet에서 callback으로 동작, 하나의 row를 받아와서 notion에 넣는다.
export const postShuttleData = async () => {
  // 노션 데이터에 넣기

  return json(
    {
      message: "셔틀 데이터를 노션에 성공적으로 업데이트했습니다.",
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    }
  );
};
