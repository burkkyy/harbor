#!/bin/bash

# @file sites/calebburke.dev/start.sh
# @author Caleb Burke
# @date Dec 10, 2023

which node > /dev/null 2>&1
[ $? -ne 0 ] && yes | apt install nodejs

which npm > /dev/null 2>&1
[ $? -ne 0 ] && yes | apt install npm

npm i --prefix /var/sites/calebburke.dev/www
npm run --prefix /var/sites/calebburke.dev/www start

