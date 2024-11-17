import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const dynamoDbClient = new DynamoDBClient();

export const handler = async (event) => {
  try {
    const id = event.id;
    const full_name = event.full_name;
    const kana_name = event.kana_name;
    const email = event.email;
    const birthdate = event.birthdate;
    const is_attend = event.is_attend;
    const timeslot = event.timeslot;
    const number_of_attendees = event.number_of_attendees;
    const first_companion_name = event.first_companion_name;
    const second_companion_name = event.second_companion_name;

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "id is required" }),
      };
    }

     let updateExpression = "SET";
     const expressionAttributeValues = {};
 
     if (full_name !== undefined) {
       updateExpression += " full_name = :full_name,";
       expressionAttributeValues[":full_name"] = { S: full_name };
     }
     if (kana_name !== undefined) {
       updateExpression += " kana_name = :kana_name,";
       expressionAttributeValues[":kana_name"] = { S: kana_name };
     }
     if (email !== undefined) {
       updateExpression += " email = :email,";
       expressionAttributeValues[":email"] = { S: email };
     }
     if (birthdate !== undefined) {
       updateExpression += " birthdate = :birthdate,";
       expressionAttributeValues[":birthdate"] = { S: birthdate };
     }
     if (is_attend !== undefined) {
       updateExpression += " is_attend = :is_attend,";
       expressionAttributeValues[":is_attend"] = { BOOL: is_attend };
     }
     if (timeslot !== undefined) {
       updateExpression += " timeslot = :timeslot,";
       expressionAttributeValues[":timeslot"] = { N: timeslot.toString() };
     }
     if (number_of_attendees !== undefined) {
       updateExpression += " number_of_attendees = :number_of_attendees,";
       expressionAttributeValues[":number_of_attendees"] = { N: number_of_attendees.toString() };
     }
     if (first_companion_name !== undefined) {
       updateExpression += " first_companion_name = :first_companion_name,";
       expressionAttributeValues[":first_companion_name"] = { S: first_companion_name };
     }
     if (second_companion_name !== undefined) {
       updateExpression += " second_companion_name = :second_companion_name,";
       expressionAttributeValues[":second_companion_name"] = { S: second_companion_name };
     }
 
     // 最後のカンマを削除
     updateExpression = updateExpression.slice(0, -1);
 
     const params = {
       TableName: "Influencers",
       Key: { id: { S: id } },
       UpdateExpression: updateExpression,
       ExpressionAttributeValues: expressionAttributeValues,
       ReturnValues: "UPDATED_NEW",
     };
 
     const command = new UpdateItemCommand(params);
     const data = await dynamoDbClient.send(command);
 
     return {
       statusCode: 200,
       body: JSON.stringify({
         message: "Influencer updated successfully",
         updatedAttributes: data.Attributes,
       }),
       headers: {
         "Content-Type": "application/json",
         "Access-Control-Allow-Origin": "*",
       },
     };
   } catch (error) {
     console.error("Error updating influencer:", error);
     return {
       statusCode: 500,
       body: JSON.stringify({ message: `Failed to update influencer: ${error.message}` }),
       headers: {
         "Content-Type": "application/json",
         "Access-Control-Allow-Origin": "*",
       },
     };
   }
 };
