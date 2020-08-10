pipeline {
  agent any
  options {
    lock resource: 'my-build-turn'
  }    
  stages {
    stage('Building image') {
      agent {
        dockerfile {
          additionalBuildArgs '-t sst.orbb.insights.frontend --build-arg BUILD_ENVIRONMENT=build:cicd_dev'
        }
      }
      steps {
        echo "Building docker file"
      }
    }
    stage('Backing up image') {
      agent any
      steps {
        echo 'Creating tar file'
        sh 'docker save --output sst.orbb.insights.frontend.tar sst.orbb.insights.frontend'
        script {
          stage('Create file') {
            if (fileExists('sst.orbb.insights.frontend.tar')) {
              echo 'docker Saved'
              echo 'Pruning'
              // sh 'docker system prune -a -f'
              echo 'id'
              sh 'id -nG'
            }
          }
          stage('Publish to remote') {
            def remote = [:]
            remote.name = 'test'
            remote.host = '10.10.30.104'
            remote.user = 'blackbox'
            remote.password = '!blackbox401'
            remote.allowAnyHosts = true
            sshPut(remote: remote, from: './sst.orbb.insights.frontend.tar', into: './dev')
            echo 'Stopping docker network'
            sshCommand(remote: remote, command: 'docker-compose -f ./dev/docker-compose.yml down')            
            echo 'Removing old image'
            sshCommand(remote: remote, failOnError: false, command: 'docker rm sst.orbb.insights.frontend')
            echo 'Loading tar file'
            sshCommand(remote: remote, command: 'docker load -i ./dev/sst.orbb.insights.frontend.tar ')
            echo 'Starting docker network'
            sshCommand(remote: remote, command: 'docker-compose -f ./dev/docker-compose.yml up -d')            
          }
        }
      }
    }
  }
}