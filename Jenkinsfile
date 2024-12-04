def PRODUCTION_BRANCH = "master"

def branchType(branchName, productionBranch) {
    if (branchName == productionBranch) {
        return 'production'
    } else {
        return 'develop'
    }
}
def gitSign
def npmVersion
def npmPublish

pipeline {
  agent { label "agent" }
  environment {
    NODE_VERSION = "20.13.1"
    AWS_REGION = "us-east-1"
    SSH_KEY_PATH = '/home/jenkins/.ssh/id_ed25519'
    SOURCE_CONTROL_HOST = 'github.com'
    SOURCE_CONTROL_USER = 'git@github.com'
  }
  stages {
    stage("scripts") {
      steps {
        configFileProvider([
            configFile(fileId: 'c7102ede-65a2-40a2-89b9-0018f71425ae', variable: 'GIT_PUSH'),
            configFile(fileId: 'd53821ca-5194-4b4b-a30a-385f33d03cff', variable: 'GIT_SIGN'),
            configFile(fileId: '661d583f-966d-484b-ba97-ea35d28343e8', variable: 'NPM_VERSION'),
            configFile(fileId: '2a833442-7210-4bb2-99eb-a0694dc119b6', variable: 'NPM_PUBLISH')
        ]) {
          script {
            gitPush = load "$GIT_PUSH"
            gitSign = load "$GIT_SIGN"
            npmVersion = load "$NPM_VERSION"
            npmPublish = load "$NPM_PUBLISH"
          }
        }
      }
    }
    stage("npm") { steps { sh 'install-tool npm' } }
    stage("dependencies") {
      steps {
        sh 'npm install'
        dir('deploy') { sh 'npm install'}
      }
    }
    stage("build") {
      environment { NODE_ENV = "production" }
      steps { sh 'npm run build' }
    }
    stage("test") { steps { sh 'npm run test' } }
    stage("lint") { steps { sh 'npm run lint' } }
    stage("sign") {
      when { not { branch PRODUCTION_BRANCH } }
      steps { script { gitSign() } }
    }
    stage("version") {
      when { not { branch PRODUCTION_BRANCH } }
      steps { script { npmVersion() } }
    }
    stage("release") {
      when { not { branch PRODUCTION_BRANCH } }
      environment { TARGET_BRANCH = "${PRODUCTION_BRANCH}" }
      steps { script { gitPush(PRODUCTION_BRANCH) } }
    }
    stage("publish") {
      options { timeout time: 1, unit: 'DAYS' }
      environment { NODE_ENV = 'production' }
      when {
        beforeInput true
        branch PRODUCTION_BRANCH
      }
      steps { lock(resource: "${env.BRANCH_NAME}-production") { script { npmPublish() } } }
    }
  }
}
