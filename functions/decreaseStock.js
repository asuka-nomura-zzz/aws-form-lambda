import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const dynamoDbClient = new DynamoDBClient();

export const handler = async (event) => {
  const id = Number(event.id);
  const decreaseBy = Number(event.decreaseBy);

  if (isNaN(id) || isNaN(decreaseBy)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "id and decreaseBy must be numbers" }),
    };
  }


  try {
    const params = {
      TableName: "Timeslots",
      Key: {
        id: { N: id.toString() },
      },
      UpdateExpression: "SET stock = stock - :decreaseBy",
      ExpressionAttributeValues: {
        ":decreaseBy": { N: decreaseBy.toString() },
      },
      ReturnValues: "UPDATED_NEW",
    };

    const command = new UpdateItemCommand(params);
    const data = await dynamoDbClient.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Stock updated successfully",
        updatedStock: data.Attributes.stock.N,
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (error) {
    console.error("Error updating stock:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to update stock" }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};
