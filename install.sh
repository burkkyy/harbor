#!/bin/bash

# @file install.sh
# @author Caleb Burke
# @date Dec 10, 2023

info(){ 
	echo -e "\e[1;34m[-]\e[0m $1" 
}

update(){ 
	echo -e "\e[1;32m[*]\e[0m $1" 
}

error(){
	echo -e "\e[1;31m[!]\e[0m $1" 
}

success(){ 
	echo -e "\e[1;32m[+]\e[0m $1" 
}

yon(){
	read -p $'::: '"$* (Y/n): " -e res
	res=${res,,}
	case $res in
		'' | [Yy]*) return 0 ;;
		*) return 1 ;;
	esac
}

# Ensure root
[ $(id -u) -ne 0 ] && { error "Please run as root"; exit 1; }

# Install dependencies
which nginx 1>/dev/null 2>/dev/null
[ $? -ne 0 ] && yes | apt install nginx

which certbot 1>/dev/null 2>/dev/null
[ $? -ne 0 ] && yes | apt install certbot

yon "Install nginx config and websites?" && {
	rm -r /etc/nginx/sites-enabled/*
	rm -r /etc/nginx/sites-available/*
	cp -r nginx/* /etc/nginx/
	cp -r sites /var/

	for website in /var/sites/*; do
		w2="sites/$(basename $website)/$(basename $website).service"
		cp $w2 /etc/systemd/system/
	done

	systemctl daemon-reload

	for website in /var/sites/*; do
		w="$(basename $website)"
		systemctl enable $w
		systemctl start $w
	done

	# Start nginx
	systemctl enable nginx
	systemctl start nginx
	[ $? -ne 0 ] && exit 1
}

yon "Do you want certbot to manage ssl?" && {
	certbot --nginx;
}

# Reset sudo auth timestamp
which sudo 1>/dev/null 2>/dev/null
[ $? -eq 0 ] && sudo -k

