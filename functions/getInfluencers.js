import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const dynamoDbClient = new DynamoDBClient();

export const handler = async (event) => {
  try {
    const params = {
      TableName: "Influencers",
    };

    // 大した数じゃないのでスキャンする
    const command = new ScanCommand(params);
    const data = await dynamoDbClient.send(command);

    const influencers = data.Items.map((item) => ({
      id: item.id?.S || null,
      createdAt: item.created_at?.N || null,
      fullName: item.full_name?.S || null,
      kanaName: item.kana_name?.S || null,
      email: item.email?.S || null,
      birthdate: item.birthdate?.S || null,
      isAttend: item.is_attend?.BOOL || null,
      timeslot: item.timeslot ? Number(item.timeslot.N) : null,
      numberOfAttendees: item.number_of_attendees ? Number(item.number_of_attendees.N) : null,
      firstCompanionName: item.first_companion_name?.S || null,
      secondCompanionName: item.second_companion_name?.S || null,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(influencers),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to fetch influencers" }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};
