#!/bin/sh

echo Deploy Start

cp -f /workspace/resources/pom.xml /workspace/java-oauth-server
cp -f /workspace/resources/appengine-web.xml /workspace/java-oauth-server/src/main/webapp/WEB-INF
cp -f /workspace/resources/authlete.properties /workspace/java-oauth-server/src/main/webapp

ln -sf  /usr/share/zoneinfo/Asia/Tokyo /etc/localtime
version=`date +"%Y%m%dt%H%M%S"`

cd /workspace/java-oauth-server/
mvn clean package
mvn package appengine:deploy -Dapp.deploy.projectId=tw-kyb -Dapp.deploy.version=${version}

echo Deploy Completed