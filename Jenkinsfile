def deploy(envName, stackName, stripeKey) {
  NPM_TOKEN = credentials('byaga-npm')
  script {
    sh label: "set username", script: "echo \"//registry.npmjs.org/:_authToken=${NPM_TOKEN}\" >> ~/.npmrc"
    sh "npm publish"
  }
}

pipeline {
  agent none
  environment {
    HOME = '.'
  }
  stages {
    stage('Build Agent') {
      agent any
      steps {
        script {
          docker.build("${STACK_NAME}-agent:${BRANCH_NAME}${BUILD_NUMBER}")
        }
      }
    }
    stage('Unit Tests') {
      agent {
        docker {
          image "${STACK_NAME}-agent:${BRANCH_NAME}${BUILD_NUMBER}"
        }
      }
      steps {
        sh script: "npm i", label: "Installing Dependencies"
        sh script: "npm run test", label: "Running Tests"
      }
      post {
        always {
          junit 'report/junit/**/*.xml'
          step([$class: 'CoberturaPublisher', coberturaReportFile: 'report/coverage/cobertura-coverage.xml'])
        }
      }
    }
    stage('Prepare for Release') {
      agent any
      when {
        beforeAgent true
        branch 'develop'
      }
      steps {
        script {
          def versionAs = input message: 'User input required', ok: 'Release!',
                                                  parameters: [choice(name: 'RELEASE_SCOPE', choices: 'patch\nminor\nmajor',
                                                               description: 'What is the release scope?')]
          sshagent(['GitLab SSH']) {
           sh "git checkout -b ${BUILD_NUMBER}"
           sh 'git fetch origin master'
           try {
            sh 'git branch -D master'
           } catch(Exception e){
           }
           sh 'git branch master FETCH_HEAD'
           sh "git checkout master"
           sh 'git merge ${BUILD_NUMBER}'
           sh "npm version ${versionAs}"
           sh "git commit -m \"NPM Version Update ${versionAs}\""
           sh "git push origin master"
          }
        }
      }
    }
    stage('Publish to NPM') {
      agent {
        docker {
          image "${STACK_NAME}-agent:${BRANCH_NAME}${BUILD_NUMBER}"
        }
      }
      when {
        beforeAgent true
        branch 'master'
      }
      steps {
        withNPM(npmrcConfig:'byaga') {
          sh label: 'deploying', script: 'npm publish'
        }
      }
    }
  }
}