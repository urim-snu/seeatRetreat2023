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

// Clear all data in a database in Notion
export const clearAllDataInDB = async (databaseId: string): Promise<void> => {
  try {
    // Get all pages in the database
    const response = await notion.databases.query({
      database_id: databaseId,
    });

    // Delete each page in the database
    const deletePromises = response.results.map((page) =>
      notion.pages.update({
        page_id: page.id,
        archived: true, // Move the page to the trash instead of permanently deleting it
      })
    );

    // Wait for all delete operations to complete
    await Promise.all(deletePromises);

    console.log("All data cleared successfully.");
  } catch (error) {
    console.error("Error clearing data:", error);
  }
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

export const putDataIntoNotionDB = async (
  databaseId: string,
  properties: any
) => {
  // put one row into notion db
  const result = await notion.pages.create({
    parent: {
      database_id: databaseId,
    },
    properties,
  });

  // console.log(JSON.stringify(result));
  return result;
};
