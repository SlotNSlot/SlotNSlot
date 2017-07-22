MAIN_BRANCH = 'master'
IS_STAGE_BUILD = (env.BRANCH_NAME == MAIN_BRANCH)

pipeline {
    agent any
    tools {
        nodejs 'nodejs 8.1.3'
    }

    stages {
        stage('SCM CHECKOUT') {
            steps {
                slackSend color: 'good', channel: "#web-build", message: "Build Started: ${env.JOB_NAME}"
                checkout scm
                sh 'git config user.email "sushi.otoro@outlook.com" && git config user.name "fish-sushi"'
                sh 'git remote -v'
            }
        }

        stage('CLEAN ENV') {
            try {
                steps {
                    sh 'rm -rf node_modules && npm cache clean -f'
                }
            } catch (err) {
                slackSend color: 'danger', failOnError: true, channel: "#web-build", message: "Build failed at CLEAN ENV: ${env.JOB_NAME}"
            }

        }

        stage('NPM INSTALL') {
            try {
                steps {
                    sh 'npm install'
                }

            } catch (err) {
                slackSend color: 'danger', failOnError: true, channel: "#web-build", message: "Build failed at NPM INSTALL: ${env.JOB_NAME}"
            }
        }

        stage('TEST') {
            try {
                steps {
                    sh 'npm test'
                }
            } catch (err) {
                slackSend color: 'danger', failOnError: true, channel: "#web-build", message: "Build failed at NPM TEST: ${env.JOB_NAME}"
            }

        }

        stage('BUILD & DEPLOY') {
            try {
                steps {
                    withCredentials([
                        [$class: 'AmazonWebServicesCredentialsBinding', accessKeyVariable: 'AWS_ACCESS_KEY_ID', credentialsId: 'jenkins iam', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']
                    ]) {
                        sh 'npm run deploy:stage'
                    }
                }
            } catch (err) {
                slackSend color: 'danger', failOnError: true, channel: "#web-build", message: "Build failed at BUILD & DEPLOY: ${env.JOB_NAME}"
            }
        }

        stage('TAGGING') {
            try {
                steps {
                    script {
                        withCredentials([usernamePassword(credentialsId: 'GITHUB_USERNAME_PASSWORD', passwordVariable: 'GIT_PASSWORD', usernameVariable: 'GIT_USERNAME')]) {
                            def GITTAG = readFile('version').trim()
                            echo GITTAG
                            sh "git tag -a ${GITTAG} -m 'Trying to deploy to S3' && git tag -af stage -m 'Trying to deploy to S3'"
                            sh 'git remote -v'
                            sh 'git push https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/SlotNSlot/SlotNSlot.git --tags -f'

                            slackSend color: 'good', channel: "#web-build", message: "Build DONE! ${env.JOB_NAME} please check https://future.slotnslot.com"
                        }
                    }
                }
            } catch (err) {
                slackSend color: 'danger', failOnError: true, channel: "#web-build", message: "Build failed at GIT TAGGING: ${env.JOB_NAME}"
            }
        }
    }
}
