import AWS from 'aws-sdk';
import { EventEmitter } from 'events';

const ONE_DAY = 86400 * 1000;

export default class DynamoDBStore extends EventEmitter {
  constructor(options = {}) {
    super();

    let { service } = options;
    const {
      key = 'Id',
      tableName = 'Session',
      params,
      ttlKey = 'Ttl',
      readCapacityUnits = 5,
      writeCapacityUnits = 5,
    } = options;

    if (!service) {
      service = new AWS.DynamoDB(params);
    }

    const documentClient = new AWS.DynamoDB.DocumentClient({ service });
    Object.assign(this, {
      key,
      tableName,
      documentClient,
      service,
      ttlKey,
      readCapacityUnits,
      writeCapacityUnits,
    });
    this.createTable();
  }

  async doesTableExist() {
    try {
      return await this.service.listTables().promise()
        .then(result => (result.TableNames.indexOf(this.tableName) !== -1));
    } catch (err) {
      throw err;
    }
  }

  async createTable() {
    if (await this.doesTableExist()) {
      return true;
    }

    const {
      tableName: TableName,
      key: AttributeName,
      readCapacityUnits: ReadCapacityUnits,
      writeCapacityUnits: WriteCapacityUnits,
    } = this;

    const params = {
      TableName,
      KeySchema: [
        { AttributeName, KeyType: 'HASH' },
      ],
      AttributeDefinitions: [
        { AttributeName, AttributeType: 'S' },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits,
        WriteCapacityUnits,
      },
    };

    try {
      await this.service.createTable(params).promise();
      await this.setTtlField().promise();
      return true;
    } catch (err) {
      throw new Error('Error creating session table');
    }
  }

  async setTtlField() {
    const { tableName: TableName, ttlKey: AttributeName } = this;
    const params = {
      TableName,
      TimeToLiveSpecification: {
        AttributeName,
        Enabled: true,
      },
    };
    try {
      await this.service.updateTimeToLive(params).promise();
    } catch (err) {
      throw new Error('Error setting TTL');
    }
  }

  getParamsForId(id) {
    const { tableName: TableName, key } = this;
    return {
      Key: {
        [key]: id,
      },
      TableName,
    };
  }

  async get(id) {
    const params = this.getParamsForId(id);
    try {
      return await this.documentClient.get(params).promise()
        .then(result => result.Item);
    } catch (err) {
      throw new Error('Unable to get session.');
    }
  }

  async set(id, session, ttl) {
    const { tableName: TableName, key, ttlKey } = this;
    const maxAge = (session.cookie && session.cookie.maxAge) ? session.cookie.maxAge : null;
    const Item = session;

    Item[key] = id;
    Item[ttlKey] = new Date((ttl || maxAge || ONE_DAY) + Date.now());
    const params = { TableName, Item };

    try {
      return await this.documentClient.put(params).promise();
    } catch (err) {
      throw new Error('Unable to set session.');
    }
  }

  async destroy(id) {
    const params = this.getParamsForId(id);
    try {
      return await this.documentClient.delete(params).promise();
    } catch (err) {
      throw new Error('Unable to delete session.');
    }
  }
}
