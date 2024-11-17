import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const dynamoDbClient = new DynamoDBClient();

export const handler = async (event) => {
  try {
    const params = {
      TableName: "Timeslots",
    };

    // 大した数じゃないのでスキャンする
    const command = new ScanCommand(params);
    const data = await dynamoDbClient.send(command);
    
    // ID順にソートする
    const sorted = data.Items.sort((a, b) => Number(a.id.N) - Number(b.id.N));

    // 型が合うよう念の為マッピング
    const timeslots = sorted.map((item) => ({
      id: Number(item.id.N),
      name: item.name.S,
      stock: Number(item.stock.N),
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(timeslots),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to fetch timeslots" }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};
