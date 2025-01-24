#!/bin/bash

# Set variables
reponame=maizum-back
repodir=/home/ec2-user/${reponame}

# Start application
cd $repodir
pm2 start app.js

# Restart web server
sudo systemctl restart nginx
