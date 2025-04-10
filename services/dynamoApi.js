import { Auth } from 'aws-amplify'
import AWS from 'aws-sdk'

const getDocumentClient = () =>
  Auth.currentCredentials().then(
    (credentials) =>
      new AWS.DynamoDB.DocumentClient({
        credentials: Auth.essentialCredentials(credentials),
      })
  )

export const putItemToUserSettingsTable = (Item) => {
  const params = {
    TableName: USER_SETTINGS_TABLE,
    Item,
  }
  return getDocumentClient().then((client) => client.put(params).promise())
}

export const getItemFromUserSettingsTable = (Key) => {
  const params = {
    TableName: USER_SETTINGS_TABLE,
    Key,
  }
  return getDocumentClient().then((client) => client.get(params).promise())
}
