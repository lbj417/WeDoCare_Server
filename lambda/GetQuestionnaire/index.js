'use strict';
console.log('Loading function');

let aws = require('aws-sdk');
let dynamo = new aws.DynamoDB.DocumentClient();

const moment = require('moment');

exports.handler = function(e, ctx, cb) {
  function handleError(err) {
    console.log('Error occurred in GetPatientQuestionnaire: ', err);
    return cb({error: err});
  }
  if (e.params && e.params.path && e.params.path.questionnaireId) {
    let questionnaireId = e.params.path.questionnaireId;
    let params = {
      TableName: 'WeDoCare_PatientQuestionnaires_DEV',
      IndexName: 'QuestionnaireIdIndex',
      KeyConditionExpression: 'questionnaireId = :qid',
      ExpressionAttributeValues: {
        ':qid': questionnaireId
      }
    };
    dynamo.query(params, function(err, questionnaire) {
      if (!err && questionnaire && questionnaire.Items && questionnaire.Items.length) {
        questionnaire.Items[0].displayDueDate = moment(questionnaire.Items[0].dueDate).format('dddd, MMM Do');
        return cb(null, questionnaire.Items[0]);
      }
      else if (!err && !questionnaire) {
        return cb(null, {});
      }
      else {
        handleError(err);
      }
    });
  }
  else {
    handleError('questionnaireId is a required field');
  }
};
