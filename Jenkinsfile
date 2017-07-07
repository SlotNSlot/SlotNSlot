MAIN_BRANCH = 'master'
IS_STAGE_BUILD = (env.BRANCH_NAME == MAIN_BRANCH)

node {
    handleStageFailure('SCM Checkout', {
        checkout scm
        echo 'DONE'
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
