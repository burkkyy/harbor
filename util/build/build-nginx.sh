#!/bin/bash

# @file build-nginx.sh
# @author Caleb Burke
# @version 1.1
# @date June 7, 2023
#
# Do not run this script from here. From the root of this project run 'npm run build-nginx'

# Store this dir
_dir=$(dirname "$0")

# Printing functions
_info=$_dir/../print/info
_update=$_dir/../print/update
_error=$_dir/../print/error
_success=$_dir/../print/success

_err_exit(){
    [ $1 ] && $_error $1
    sudo -k
    exit 1
}

_exit(){
    [ $1 ] && $_info $1
    exit 0
}

builder() {
    for arg in $@; do
        n1=$arg[@]
        n2=("${!n1}")
        
        p1=${n2[0]}
        p2=${n2[1]}

        $_update "Copying $p1 to $p2"
        [ -f $p2 ] && sudo rm $p2
        [ -d $p2 ] && sudo rm -r $p2
        sudo cp -r $p1 $p2 || _err_exit
    done
}

write_cronjob(){
    # $1 the job to append to crontab
    # $2 the user for the cronjob
    tmp=$(mktemp)
    sudo crontab -u $2 -l 2>/dev/null 1>$tmp # write current cronjobs to the temp file
    echo "$1" >> $tmp # append our job to the crontab
    sudo crontab -u $2 $tmp # Write the tmp file to the crontab
    $_info "Wrote cronjob for user: $2"
    rm $tmp
}

# auto git pull build function
make_auto_pull(){
    write_cronjob "@daily git -C $(pwd) pull" $(whoami)
}

# auto update build function
make_auto_update(){
    write_cronjob "@daily nginx -s reload" "root"
}

# yes or no function
yon(){
    read -p $'::: '"$* (Y/n): " -e res
    res=${res,,}
    case $res in
        '' | [Yy]*) return 0 ;;
        *) return 1 ;;
    esac
}

# Reset sudo authentication timestamp
sudo -k

# Prompt the user for sudo password
sudo -v

# Check if the user successfully entered their sudo password
[ $? -ne 0 ] && { _err_exit "sudo"; }

# Define where a each file is getting copied to
nginx_conf=("$(pwd)/nginx/nginx.conf" "/etc/nginx/nginx.conf")
sites_enabled=("$(pwd)/nginx/sites-enabled" "/etc/nginx/sites-enabled/")
sites_available=("$(pwd)/nginx/sites-available" "/etc/nginx/sites-available/")

# Call builder on each file/folder
builder nginx_conf sites_enabled sites_available

# Check if nginx.conf is correct
$_update "Checking nginx.conf..."
sudo nginx -t 2>error.log
[ $? -eq 0 ] && $_success "Built nginx successfully." || _err_exit "update"

# Set up cron job for auto git pull
yon "Set up auto git pulls?" && make_auto_pull || _exit

# Set up cron job for updating the website files
yon "Set up auto update?" && make_auto_update || _exit

# Reset sudo authentication timestamp
sudo -k
