import AWS from 'aws-sdk';
import { EventEmitter } from 'events';

export default class DynamoDBStore extends EventEmitter {
  constructor(options = {}) {
    super();
    const {
      credentials,
      region,
      tableName = 'Session',
      key = 'Id', 
      client,
    } = options;

    if (!client) {
      client = new AWS.DynamoDB({ credentials, region }).DocumentClient();
    }
    this.client = client;
    this.Key = key;
    this.TableName = tableName;
  }

  getParamsForId(id) {
    const { TableName, Key } = this;
    return {
      Key: {
        [Key]: id,
      },
      TableName,
    };
  }

  async get(id) {
    const params = this.getParamsForId(id);
    try {
      return await this.client.get(params).promise();
    } catch (err) {
      return null;
    }
  }

  async set(id, session, ttl) {
    const { TableName, Key } = this;
    const Items = session;
    Items[Key] = id;
    const params = { TableName, Items };
    try {
      return await this.client.put(params).promise();
    } catch (err) {
      return null;
    }
  }

  async destroy(id) {
    const params = this.getParamsForId(id);
    try {
      return await this.client.delete(params).promise();
    } catch (err) {
      return null;
    }
  }
}
