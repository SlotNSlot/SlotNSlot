MAIN_BRANCH = 'master'
IS_STAGE_BUILD = (env.BRANCH_NAME == MAIN_BRANCH)

pipeline {
    agent any
    tools {
        nodejs 'nodejs 8.1.3'
    }

    stages {
        stage('SCM CHECKOUT') {
            stpes {
                checkout scm
            }
        }

        stage('NPM INSTALL') {
            stpes {
                sh 'npm install'
            }
        }

        stage('BUILD & DEPLOY') {
            stpes {
                withCredentials([
                    [$class: 'AmazonWebServicesCredentialsBinding', accessKeyVariable: 'AWS_ACCESS_KEY_ID', credentialsId: 'jenkins iam', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']
                ]) {
                    sh 'npm run deploy:stage'
                }
            }
        }
    }
}

private def handleStageFailure(String stageName, Closure stageDefinition) {
    stage(stageName) {
        try {
            stageDefinition()
        } catch (err) {
            setCurrentBuildFailureStatus("${stageName} failed: ${err}")
            throw err
        }
    }
}

private def setCurrentBuildFailureStatus(description) {
    currentBuild.result = 'FAILURE'
    currentBuild.description = description
}
