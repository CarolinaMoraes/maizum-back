#!/bin/bash

# Set variables
reponame=maizum-back
repodir=/var/www/${reponame}
webdir=/srv/www/maizum-back
codedeploygroupname=maizum-depl-grp
s3bucket=codedeploy-maizum-bucket

# Set permissions
sudo chown -R ec2-user:ec2-user $repodir
sudo chmod 755 $repodir/codedeploy-scripts/*.sh

# Copy files into place
[ -d $webdir ] && rm -frv ${webdir}/*
aws s3 sync s3://${s3bucket}/${codedeployname}/ ${webdir}/ --delete
