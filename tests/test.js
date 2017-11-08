import sinon from 'sinon';
import AWS from 'aws-sdk';
import DocumentClient from 'aws-sdk/lib/dynamodb/document_client';

import Store from '../src/store';
import DynamoDBMock from './utilities/DynamoDBMock';

describe('DynamoDB session store', () => {

  let spy;
  let aws;

  beforeEach(() => {
    sinon.stub(DynamoDBMock.prototype, 'DocumentClient').callsFake(() => ({
      get: sinon.spy(),
    }));
    aws = { DynamoDB: DynamoDBMock };
    Store.__Rewire__('AWS', { DynamoDB: DynamoDBMock });
  });

  it('should set up aws with credentials when supplied', () => {
    const store = new Store({ credentials: 'credentials' });
    aws.DynamoDB.should.have.been.calledWithNew();
  });
  it('should be able to add a session', () => {

  });
  it('should be able to get a session', () => {
    
  });
  it('should be able to update a session', () => {
    
  });
  it('should be able to destroy a session', () => {
    
  });
});
