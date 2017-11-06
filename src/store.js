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
      client = new AWS.DynamoDB({ credentials, region });
    }
    this.client = client;
    this.Key = key;
    this.TableName = tableName;

  }

  async get(id) {
    const { TableName, Key } = this;
    const params = {
      Key: {
        [Key]: {
          S: id,
        },
      },
      TableName,
    };
    try {
      const record = await this.client.getItem(params).promise();
    } catch (err) {

    }
  }

  async set(sid, sess, ttl) {

  }

  
}