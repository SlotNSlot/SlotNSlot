node {
    handleStageFailure('Start', {
        checkout([$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'LocalBranch', localBranch: 'master']], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'GITHUB_USERNAME_PASSWORD', url: 'https://github.com/SlotNSlot/SlotNSlot']]])

        echo 'START STAGE DEPLOY BUILD'
        echo scm
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
