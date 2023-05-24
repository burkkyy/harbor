#!/bin/bash

config=$PWD/nginx/nginx.conf

nginx -c $config -t 1>/dev/null 2>/dev/null
if [ $? -ne 0 ]; then echo "[!] Not vaild nginx.conf"; exit 1; fi

