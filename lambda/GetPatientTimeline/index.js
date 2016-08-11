'use strict';
console.log('Loading function');

let aws = require('aws-sdk');
let dynamo = new aws.DynamoDB.DocumentClient();

const moment = require('moment');
const _ = require('lodash');

exports.handler = function(e, ctx, cb) {
  function handleError(err) {
    console.log('Error occurred in GetPatientTimeline: ', err);
    return cb({error: err});
  }
  if (e.params && e.params.path && e.params.path.patientId) {
    var startDate,
      endDate;
    if (e.params && e.params.querystring && e.params.querystring.startDate) {
      startDate = moment(e.params.querystring.startDate).startOf('week').toISOString();
      endDate = moment(e.params.querystring.startDate).endOf('week').toISOString();
    }
    else {
      startDate = moment().startOf('week').toISOString();
      endDate = moment().endOf('week').toISOString();
    }
    let patientId = e.params.path.patientId;
    let timeline = {
      displayStartDate: moment(startDate).format('MMMM Do, YYYY'),
      days: [{
        formattedDate: moment(startDate).format('YYYY-MM-DD'),
        dayOfWeek: moment(startDate).format('dddd'),
        questionnaires: [],
        prescriptions: [{
          name: 'Lipitor',
          strength: '50 mg',
          instructions: 'Take one tablet three times a day.'
        }],
        checklists: [],
        appointments: []
      }, {
        formattedDate: moment(startDate).add(1, 'd').format('YYYY-MM-DD'),
        dayOfWeek: moment(startDate).add(1, 'd').format('dddd'),
        questionnaires: [],
        prescriptions: [],
        checklists: [],
        appointments: []
      }, {
        formattedDate: moment(startDate).add(2, 'd').format('YYYY-MM-DD'),
        dayOfWeek: moment(startDate).add(2, 'd').format('dddd'),
        questionnaires: [],
        prescriptions: [],
        checklists: [],
        appointments: [{
          time: '13:00',
          displayTime: '1:30PM',
          provider: 'Dr. Robert',
          location: '1311 SE 3rd St., Atlanta, GA 30309'
        }]
      }, {
        formattedDate: moment(startDate).add(3, 'd').format('YYYY-MM-DD'),
        dayOfWeek: moment(startDate).add(3, 'd').format('dddd'),
        questionnaires: [],
        prescriptions: [],
        checklists: [],
        appointments: []
      }, {
        formattedDate: moment(startDate).add(4, 'd').format('YYYY-MM-DD'),
        dayOfWeek: moment(startDate).add(4, 'd').format('dddd'),
        questionnaires: [],
        prescriptions: [],
        checklists: [],
        appointments: []
      }, {
        formattedDate: moment(startDate).add(5, 'd').format('YYYY-MM-DD'),
        dayOfWeek: moment(startDate).add(5, 'd').format('dddd'),
        questionnaires: [],
        prescriptions: [],
        checklists: [],
        appointments: []
      }, {
        formattedDate: moment(startDate).add(6, 'd').format('YYYY-MM-DD'),
        dayOfWeek: moment(startDate).add(6, 'd').format('dddd'),
        questionnaires: [],
        prescriptions: [],
        checklists: [],
        appointments: []
      }]
    };
    let params = {
      TableName: 'WeDoCare_PatientQuestionnaires_DEV',
      IndexName: 'PatientDueDateIndex',
      KeyConditionExpression: 'patientId = :hkey and dueDate BETWEEN :skey AND :ekey',
      ExpressionAttributeValues: {
        ':hkey': patientId,
        ':skey': startDate,
        ':ekey': endDate
      }
    };
    dynamo.query(params, function(err, questionnaires) {
      if (!err && questionnaires && questionnaires.Items) {
        questionnaires.Items.forEach(function(q) {
          var dueDate = moment(q.dueDate).format('YYYY-MM-DD');
          var index = _.findIndex(timeline.days, function(o) {
            return o.formattedDate === dueDate;
          });
          if (index !== -1) {
            timeline.days[index].questionnaires.push(q);
          }
        });
        return cb(null, timeline);
      }
      else if (!err && !questionnaires) {
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
};
