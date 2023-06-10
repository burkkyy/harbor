#!/bin/bash

# @file build-nginx.sh
# @author Caleb Burke
# @version 1.3
# @date June 9, 2023
#
# DO NOT RUN this script from here. 
# From the root of this project run 'npm run build-nginx'

# Store this dir
_dir=$(dirname "$0")

# Printing functions
_info=$_dir/../print/info
_update=$_dir/../print/update
_error=$_dir/../print/error
_success=$_dir/../print/success

# Define where a each file is getting copied to
nginx_conf=("$(pwd)/nginx/nginx.conf" "/etc/nginx/nginx.conf")
sites_enabled=("$(pwd)/nginx/sites-enabled" "/etc/nginx/sites-enabled/")
sites_available=("$(pwd)/nginx/sites-available" "/etc/nginx/sites-available/")

[[ "$0" != "util/build/build-nginx.sh" ]] && { ../print/error "path"; exit 1; }

builder() {
    for arg in $@; do
        n1=$arg[@]
        n2=("${!n1}")
        
        p1=${n2[0]}
        p2=${n2[1]}

        echo -e "\e[0;32m[*]\e[0m Copying $p1 to $p2"
        [ -f $p2 ] && sudo rm $p2
        [ -d $p2 ] && sudo rm -r $p2
        sudo cp -r $p1 $p2 || ${ sudo -k; exit 1; }
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
    out=$_dir/cfg/update-harbor.job
    [ ! -f $out ] && { $_info "Auto git pull was already built"; return; }
    
    # Build the cronjob
    echo "git -C $(pwd) pull" >> $out

    # Move it to /usr/local/bin/ so our cronjob can file it
    sudo mv $out /usr/local/bin/

    write_cronjob "@daily /usr/local/bin/update-harbor.job" "root";
}

# auto update build function
make_auto_update(){
    out=$_dir/cfg/update-nginx.job
    [ ! -f $out ] && { $_info "Auto update nginx was already built"; return; }

    # Build the update-nginx.sh script
    echo "nginx_conf=(${nginx_conf[*]})" >> $out
    echo "sites_enabled=(${sites_enabled[*]})" >> $out
    echo "sites_available=(${sites_available[*]})" >> $out
    echo $(declare -f builder) >> $out
    echo "builder nginx_conf sites_enabled sites_available" >> $out

    # Test the script
    ./$_dir/cfg/update-nginx.job

    # If script is wrong, clear it and error out. Overwise move on
    sudo nginx -t
    [ $? -ne 0 ] && { exit 1; }

    # Move it to /usr/local/bin/ so our cronjob can file it
    [ -f $out ] && sudo mv $out /usr/local/bin/ || exit 1

    # Write a cron job that will call it
    write_cronjob "@daily /usr/local/bin/update-nginx.job" "root"

    # Set up the cron job to run update-nginx.sh once a day
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
[ $? -ne 0 ] && { _exit "sudo"; exit 1; }

# Call builder on each file/folder
builder nginx_conf sites_enabled sites_available

# Check if nginx.conf is correct
$_update "Checking nginx.conf..."
sudo nginx -t 2>error.log
[ $? -eq 0 ] && $_success "Built nginx successfully." || { $_error "update"; exit 1; }

# Set up cron job for auto git pull
yon "Set up auto git pulls?" && make_auto_pull

# Set up cron job for updating the website files
yon "Set up auto update?" && make_auto_update

# Reset sudo authentication timestamp
sudo -k
