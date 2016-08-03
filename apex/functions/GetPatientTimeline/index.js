'use strict';
console.log('Loading function');

let aws = require('aws-sdk');
let dynamo = new aws.DynamoDB.DocumentClient();

exports.handle = function(e, ctx, cb) {
  function handleError(err) {
    console.log('Error occurred in GetPatientTimeline: ', err);
    return cb({error: err});
  }
  if (e.params && e.params.path && e.params.path.patientId) {
    // get questionnaires
    let patientId = e.params.path.patientId;
    let timeline = {};
    let params = {
      TableName: 'WeDoCare_PatientQuestionnaires_DEV',
      IndexName: 'PatientDueDateIndex',
      KeyConditionExpression: 'patientId = :hkey and dueDate > :rkey',
      ExpressionAttributeValues: {
        ':hkey': patientId,
        ':rkey': '2016-07-31'
      }
    };
    dynamo.query(params, function(err, questionnaires) {
      if (!err && questionnaires && questionnaires.Items) {
        timeline.questionnaires = questionnaires.Items;
        return cb(null, timeline);
      }
      else if (!err && !questionnaires) {
        timeline.questionnaires = [];
        return cb(null, timeline);
      }
      else {
        handleError(err);
      }
    });
  }
  else {
    handleError('patientId is a required field');
  }
}
