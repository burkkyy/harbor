#!/bin/bash

# @file sites/conceptflowmedia.com/start.sh
# @author Caleb Burke
# @date Dec 10, 2023

which node > /dev/null 2>&1
[ $? -ne 0 ] && yes | apt install nodejs

which npm > /dev/null 2>&1
[ $? -ne 0 ] && yes | apt install npm

npm i --prefix /var/sites/conceptflowmedia.com/www/
npm run --prefix /var/sites/conceptflowmedia.com/www/ start

