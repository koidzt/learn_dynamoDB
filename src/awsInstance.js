/*eslint-disable no-debugger*/
import AWS from 'aws-sdk';

const documentClient = new AWS.DynamoDB.DocumentClient({
  accessKeyId: 'AKIAYA57AIKNSJVOZJ76',
  secretAccessKey: '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',
  region: 'us-east-2',
});

export default { documentClient: documentClient };
