import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";

const dynamoDbClient = new DynamoDBClient();

export const handler = async (event) => {
  const id = event.id;

  // UUIDのチェック
  if (!id || typeof id !== "string") {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Valid UUID id is required" }),
    };
  }

  try {
    const params = {
      TableName: "Influencers",
      Key: {
        id: { S: id }, // UUIDは文字列として扱う
      },
      ReturnValues: "ALL_OLD", // 削除されたアイテムの情報を返す
    };

    const command = new DeleteItemCommand(params);
    const data = await dynamoDbClient.send(command);

    if (!data.Attributes) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Influencer not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Influencer deleted successfully",
        deletedItem: data.Attributes,
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (error) {
    console.error("Error deleting influencer:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to delete influencer" }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};
