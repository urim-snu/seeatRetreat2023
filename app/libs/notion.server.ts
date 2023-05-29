import { Client } from "@notionhq/client";

const SEEAT_MOIM_DB_ID = process.env.SEEAT_MOIM_DB_ID;

// intialize Notion client globally

export const notion = new Client({
  auth: process.env.NOTION_SECRET,
});

export async function getMoimList() {
  const response = await notion.databases.query({
    database_id: SEEAT_MOIM_DB_ID || "",
  });

  return response.results;
}

getMoimList().then((results) => {
  console.log(results);
});
