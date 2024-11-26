def PRODUCTION_BRANCH = "master"
def SIGN_SCRIPT = 'd53821ca-5194-4b4b-a30a-385f33d03cff'
def VERSION_SCRIPT = '661d583f-966d-484b-ba97-ea35d28343e8'
def PUBLISH_SCRIPT = '2a833442-7210-4bb2-99eb-a0694dc119b6'

def branchType(branchName, productionBranch) {
    if (branchName == productionBranch) {
        return 'production'
    } else {
        return 'develop'
    }
}

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
      steps {
        configFileProvider([configFile(fileId: SIGN_SCRIPT, variable: 'SIGN_SCRIPT')]) {
          script {
            def signScript = load(SIGN_SCRIPT)
            signScript()
          }
        }
      }
    }
    stage("version") {
      when { not { branch PRODUCTION_BRANCH } }
      steps {
        configFileProvider([configFile(fileId: VERSION_SCRIPT, variable: 'VERSION_SCRIPT')]) {
          script {
            def versionScript = load(VERSION_SCRIPT)
            versionScript()
          }
        }
      }
    }
    stage("release") {
      when { not { branch PRODUCTION_BRANCH } }
      environment { TARGET_BRANCH = "${PRODUCTION_BRANCH}" }
      steps {
        sh 'git branch $TARGET_BRANCH'
        sh 'git push origin $TARGET_BRANCH'
      }
    }
    stage("publish") {
      options { timeout(time: 1, unit: 'DAYS') }
      environment {
        NODE_ENV = 'production'
      }
      when {
        beforeInput true
        branch PRODUCTION_BRANCH
      }
      steps {
        lock(resource: "${env.BRANCH_NAME}-production") {
          configFileProvider([configFile(fileId: 'publish-groovy', variable: 'PUBLISH_SCRIPT')]) {
            script {
              def publishScript = load(PUBLISH_SCRIPT)
              publishScript()
            }
          }
        }
      }
    }
  }
}
