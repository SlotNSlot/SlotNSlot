MAIN_BRANCH = 'master'
IS_STAGE_BUILD = (env.BRANCH_NAME == MAIN_BRANCH)
DOCKER_IMAGE_NAME = 'node:8.1'

node {
    withEnv(["PATH+NODE=${tool name: 'node-8.1.2', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'}/bin"]) {
        sh 'node -v'
    }

    handleStageFailure('SCM CHECKOUT', {
        checkout scm
        echo 'DONE'
    })

    handleStageFailure('NPM INSTALL', {
        sh 'npm install'
    })
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
