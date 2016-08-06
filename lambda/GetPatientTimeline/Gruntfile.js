'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        env: {},
        pkg: grunt.file.readJSON('package.json'),

        lambda_invoke: {
            default: {
                options: {
                    profile: 'wedocare', // broken in current version of grunt-aws-lambda
                    'event': 'event.json'
                }
            }
        },

        lambda_package: {
            default: {
                options: {}
            }
        },

        lambda_deploy: {
            default: {
                options: {
                    profile: 'wedocare'
                },
                arn: 'arn:aws:lambda:us-east-1:927764861358:function:WeDoCare_Server_GetPatientTimeline'
            }
        }
    });

    grunt.loadNpmTasks('grunt-aws-lambda');

    grunt.registerTask('default', ['lambda_invoke']);
    grunt.registerTask('package', ['lambda_package']);
    grunt.registerTask('deploy', ['lambda_package', 'lambda_deploy']);
};
