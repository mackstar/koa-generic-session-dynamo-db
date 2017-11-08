export default class DynamoDB {
  constructor(options = {}) {
    this.options = options;
  }

  DocumentClient() {
    return {
      get: () => {},
      post: () => {},
    }
  }
  
}