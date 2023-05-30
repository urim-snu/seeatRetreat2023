import { json } from "@remix-run/node";
import { clearAllDataInDB, notion } from "~/libs/notion.server";
import { getShuttleData } from "~/libs/sheet.server";

export const fetchAllShuttleData = async () => {
  // 노션 데이터 전부 날리기
  await clearAllDataInDB(process.env.NOTION_SHUTTLE_DB_ID || "");

  // 구글 스프레드시트 데이터 가져오기
  const notionData = await getShuttleData();

  // put notionData elements into notion db, concurrently
  const putNotionDataPromises = notionData.map((properties) =>
    putShuttleDataIntoNotionDB(properties)
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

const putShuttleDataIntoNotionDB = async (properties: any) => {
  // put one row into notion db

  await queryDatabaseProperties(process.env.NOTION_SHUTTLE_DB_ID || "");

  const result = await notion.pages.create({
    parent: {
      database_id: process.env.NOTION_SHUTTLE_DB_ID || "",
    },
    properties,
  });

  // console.log(JSON.stringify(result));
  return result;
};

// query properties of a database in Notion
export const queryDatabaseProperties = async (databaseId: string) => {
  try {
    const response = await notion.databases.retrieve({
      database_id: databaseId,
    });

    console.log(JSON.stringify(response));
  } catch (error) {
    console.error(error);
  }
};
