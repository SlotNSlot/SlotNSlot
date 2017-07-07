IS_STAGE_BUILD = (env.BRANCH_NAME == 'master')

node {
    handleStageFailure('SCM Checkout', {
        if (IS_STAGE_BUILD) {
            checkout scm
        } else {
            checkout(
                changelog: true,
                poll: false,
                scm: [
                    $class: 'GitSCM',
                    branches: [
                        [name: "refs/heads/${env.BRANCH_NAME}"]
                    ],
                    extensions: [
                        [$class: 'PreBuildMerge', options: [fastForwardMode: 'FF', mergeRemote: 'origin', mergeTarget: MAIN_BRANCH]]
                    ],
                    userRemoteConfigs: [[credentialsId: 'GITHUB_USERNAME_PASSWORD', url: 'https://github.com/SlotNSlot/SlotNSlot']]])
                ]
            )
        }

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
