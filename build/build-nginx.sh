#!/bin/bash

# @file build-nginx.sh
# @author Caleb Burke
# @version 1.0
# @date June 7, 2023

# Printing functions
_info="$(dirname "$0")/info"
_update="$(dirname "$0")/update"
_error="$(dirname "$0")/error"

outpath=/var/www
config=/etc/nginx/nginx.conf
sites_enabled=/etc/nginx/sites-enabled
sites_available=/etc/nginx/sites-available

# Reset sudo authentication timestamp
sudo -k

# Prompt the user for sudo password
sudo -v

# Check if the user successfully entered their sudo password
[ $? -ne 0 ] && { $_error "sudo"; exit 1; }

# Update html/css/js
$_update "Updating $outpath..."
[ -d $outpath ] && sudo rm -r $outpath
sudo cp -r www/ $outpath || exit 1

# Update config file
$_update "Updating $config..."
[ -f $config ] && sudo rm $config
sudo cp nginx/nginx.conf $config || exit 1

# Update sites-enabled
$_update "Updating $sites_enabled..."
[ -d $sites_enabled ] && sudo rm -r $sites_enabled
sudo cp -r nginx/sites-enabled/ $sites_enabled || exit 1

# Update sites-available
$_update "Updating $sites_available..."
[ -d $sites_available ] && sudo rm -r $sites_available
sudo cp -r nginx/sites-available/ $sites_available || exit 1

# Check if nginx.conf is correct
nginx -t 2>error.log
[ $? -eq 0 ] && $_info "Updated successfully." || $_error "update"

# Reset sudo authentication timestamp
sudo -k
