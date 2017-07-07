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
                checkout scm
                sh 'git config user.email "sushi.otoro@outlook.com" && git config user.name "fish-sushi"'
                sh 'git remote -v'
            }
        }

        stage('NPM INSTALL') {
            steps {
                sh 'npm install'
            }
        }

        stage('BUILD & DEPLOY') {
            steps {
                withCredentials([
                    [$class: 'AmazonWebServicesCredentialsBinding', accessKeyVariable: 'AWS_ACCESS_KEY_ID', credentialsId: 'jenkins iam', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']
                ]) {
                    sh 'npm run deploy:stage'
                }
            }
        }

        stage('TAGGING') {
            steps {
                script {
                    def GITTAG = readFile('version').trim()
                    echo GITTAG
                    sh "git tag -a ${GITTAG} -m 'Trying to deploy to S3' && git tag -af stage -m 'Trying to deploy to S3'"
                    sh 'git push origin --tags -f'
                }
            }
        }
    }
}

