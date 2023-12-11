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

yon "Install nginx config?" && {
	rm -r /etc/nginx/sites-enabled/*
	rm -r /etc/nginx/sites-available/*
	cp -r nginx/* /etc/nginx/
	cp -r sites /var/

	update "Starting up nginx daemon..."
	systemctl enable nginx 1>/dev/null
	systemctl start nginx 1>/dev/null
	systemctl status nginx 1>/dev/null
	[ $? -ne 0 ] && { error "Failed to start up nginx daemon!"; exit 1; }
	success "Successfully started up nginx daemon!"
}

yon "Install websites and their dependencies?" && {
	for website in /etc/nginx/sites-enabled/*; do
		w1=${website%.*}
		w2="sites/$w1/$w1.service"
		cp $w2 /etc/systemd/system/

		for package in $(cat /var/sites/$w1/dependencies.txt); do
			yes | apt install $package
		done
	done

	systemctl daemon-reload

	for website in /var/sites/*; do
		update "Starting up $website..."
		w="$(basename $website)"
		systemctl enable $w 1>/dev/null
		systemctl start $w 1>/dev/null
		systemctl status $w 1>/dev/null
		[ $? -ne 0 ] && { error "Failed to start up $website"; exit 1; }
		success "Started up $website!"
	done
}

yon "Do you want certbot to manage ssl?" && {
	certbot --nginx
}

# Reset sudo auth timestamp
which sudo 1>/dev/null 2>/dev/null
[ $? -eq 0 ] && sudo -k

