import sinon from 'sinon';

import Store from '../src/store';

describe('DynamoDB session store', () => {

  let spy;
  let aws;

  beforeEach(() => {
    let DynamoDB = sinon.spy(() => sinon.createStubInstance(DynamoDB));
    DynamoDB.DocumentClient = 
    aws = {
      DynamoDB
    }
    Store.__Rewire__('AWS', { DynamoDB });
    
  });

  it('should set up aws with credentials when supplied', () => {
    const store = new Store({ credentials: 'credentials' });
    store();
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
