MAIN_BRANCH = 'master'
IS_STAGE_BUILD = (env.BRANCH_NAME == MAIN_BRANCH)

node {
    tools {
        nodejs 'Node 8.1.2'
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
