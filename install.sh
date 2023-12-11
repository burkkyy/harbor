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

which snap 1>/dev/null
[ $? -ne 0 ] && yes | apt install snapd

snap install --classic certbot
ln -s /snap/bin/certbot /usr/bin/certbot

cp -r nginx/* /etc/nginx/
cp -r sites /var/

# Start nginx
systemctl enable nginx
systemctl start nginx

# Start certbot
certbot --nginx

# Reset sudo auth timestamp
which sudo
[ $? -eq 0 ] && sudo -k

