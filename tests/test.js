import sinon from 'sinon';
import chai from 'chai';
import sinonChai from 'sinon-chai';

import Store from '../src/store';
import DynamoDBMock from './utilities/DynamoDBMock';

chai.should();
chai.use(sinonChai);


describe('DynamoDB session store', () => {
  let spies;

  before(() => {
    spies = { get: sinon.stub(), delete: sinon.stub() };
    sinon.stub(DynamoDBMock.prototype, 'DocumentClient').callsFake(() => ({
      get: spies.get.returns({ promise: () => Promise.resolve('got') }),
      delete: spies.delete.returns({ promise: () => Promise.resolve('deleted') }),
    }));
    Store.__Rewire__('AWS', { DynamoDB: DynamoDBMock });
  });

  it('should set up aws with credentials when supplied', async () => {
    const store = new Store({ credentials: 'credentials' });
    const response = await store.get(1);
    response.should.equal('got');
    spies.get.should.have.been.calledWith({ Key: { Id: 1 }, TableName: 'Session' });
  });
  // it('should be able to add a session', () => {

  // });
  // it('should be able to get a session', () => {
    
  // });
  // it('should be able to update a session', () => {
    
  // });
  it('should be able to delete a session', async () => {
    const store = new Store({ credentials: 'credentials' });
    const response = await store.destroy(1);
    response.should.equal('deleted');
    spies.delete.should.have.been.calledWith({ Key: { Id: 1 }, TableName: 'Session' });
  });
  after(() => {
    Store.__ResetDependency__('AWS');
  });
});
