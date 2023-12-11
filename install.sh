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
if [[ $(id -u) -ne 0 ]]; then
	which sudo
	[ $? -ne 0 ] && { error "Please run as root"; exit 1; }
	sudo -kv
	[ $? -ne 0 ] && { error "Please run as root"; exit 1; }
fi

# Install dependencies
which nginx 1>/dev/null
[ $? -ne 0 ] && yes | apt install nginx

which certbot 1>/dev/null
[ $? -ne 0 ] && yes | apt install certbot

yon "Do you want to clear current nginx config?" && {
	rm -r /etc/nginx/sites-enabled/*;
	rm -r /etc/nginx/sites-available/*;
	cp -r nginx/* /etc/nginx/;
}

cp -r sites /var/

# Start nginx
systemctl enable nginx
systemctl start nginx
[ $? -ne 0 ] && exit 1

yon "Do you want certbot to manage ssl?" && {
	for website in ./nginx/sites-enabled; do
		certbot --nginx -d $website
	done
}

# Reset sudo auth timestamp
which sudo 1>/dev/null
[ $? -eq 0 ] && sudo -k

