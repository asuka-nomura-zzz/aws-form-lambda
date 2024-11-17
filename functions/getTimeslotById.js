import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

const dynamoDbClient = new DynamoDBClient();

export const handler = async (event) => {
  const id = event.pathParameters.id;

  try {
    const params = {
      TableName: "Timeslots",
      Key: {
        id: { N: id },
      },
    };

    const command = new GetItemCommand(params);
    const data = await dynamoDbClient.send(command);

    if (data.Item) {
      const timeslot = {
        id: Number(data.Item.id.N),
        name: data.Item.name.S,
        stock: Number(data.Item.stock.N),
      };

      return {
        statusCode: 200,
        body: JSON.stringify(timeslot),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Timeslot not found" }),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      };
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to fetch timeslot" }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};
