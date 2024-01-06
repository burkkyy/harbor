#!/bin/bash

# @file install.sh
# @author Caleb Burke
# @date Dec 10, 2023

info(){ echo -e "\e[1;34m[-]\e[0m $1"; }

update(){ echo -e "\e[1;32m[*]\e[0m $1"; }

error(){ echo -e "\e[1;31m[!]\e[0m $1"; }

success(){ echo -e "\e[1;32m[+]\e[0m $1"; }

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
which nginx >/dev/null 2>&1
[ $? -ne 0 ] && yes | apt install nginx

yon "Remove current nginx config?" && {
	rm -r /etc/nginx/sites-enabled/* /etc/nginx/sites-available/*
	cp -r nginx/* /etc/nginx/
	cp -r sites /var/

	update "Starting up nginx daemon..."
	systemctl enable nginx >/dev/null
	systemctl start nginx >/dev/null
	systemctl status nginx >/dev/null
	[ $? -ne 0 ] && { error "Failed to start up nginx daemon!"; exit 1; }
	success "Successfully started up nginx daemon!"

	for website in /etc/nginx/sites-enabled/*; do
		w1=$(basename ${website%.*})
		w2="sites/$w1/$w1.service"
		service_name=$(basename $w2)
		systemctl status $service_name >/dev/null
		[ $? -ne 4 ] &&\
		yon "Overwrite $service_name?" &&\
		systemctl stop $service_name &&\
		systemctl disable $service_name
		cp $w2 /etc/systemd/system/
	done

	systemctl daemon-reload

	for website in /etc/nginx/sites-enabled/*; do
		w1="$(basename ${website%.*})"
		update "Starting up $w1..."
		systemctl enable $w1 >/dev/null &&\
		systemctl start $w1 >/dev/null &&\
		systemctl is-active $w1 >/dev/null
		[ $? -ne 0 ] && { error "Failed to start up $w1"; exit 1; }
		success "Started up $w1!"
	done
}

yon "Do you want certbot to manage ssl?" && {
	which certbot >/dev/null 2>&1
	[ $? -ne 0 ] && yes | apt install certbot
	certbot --nginx
}

# Reset sudo auth timestamp
which sudo >/dev/null 2>&1
[ $? -eq 0 ] && sudo -k

