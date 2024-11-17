import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const dynamoDbClient = new DynamoDBClient();

export const handler = async (event) => {
  const id = Number(event.id);
  const newStock = Number(event.newStock);
  const newName = event.newName;

  if (isNaN(id) || isNaN(newStock) || !newName) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "id, newStock must be numbers, and newName is required" }),
    };
  }

  try {
    const params = {
      TableName: "Timeslots",
      Key: {
        id: { N: id.toString() },
      },
      UpdateExpression: "SET stock = :newStock, #name = :newName",
      ExpressionAttributeValues: {
        ":newStock": { N: newStock.toString() },
        ":newName": { S: newName },
      },
      ExpressionAttributeNames: {
        "#name": "name", // 'name'は予約語なのでエイリアスを使用
      },
      ReturnValues: "UPDATED_NEW",
    };

    const command = new UpdateItemCommand(params);
    const data = await dynamoDbClient.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Stock and name updated successfully",
        updatedStock: data.Attributes.stock.N,
        updatedName: data.Attributes.name.S,
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (error) {
    console.error("Error updating stock and name:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to update stock and name" }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};

