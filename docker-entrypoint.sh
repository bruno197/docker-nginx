#!/usr/bin/env bash

set -e

MAVEN=$(which mvn)

build_project() {
    "${MAVEN}" clean install -f /etc/nome/pom.xml
}

startServer() {
    service nginx start && nohup java -jar /etc/nome/target/lanches.jar --server.port=8081
}

build_project
startServer
