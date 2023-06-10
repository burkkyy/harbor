#!/bin/bash

# @file build-node.sh
# @author Caleb Burke
# @version 1.0
# @date June 7, 2023
#
# Do not run this script from here. From the root of this project run 'npm run build-node'

# Store this dir
_dir=$(dirname "$0")

# Printing functions
_info=$_dir/../print/info
_update=$_dir/../print/update
_error=$_dir/../print/error
_success=$_dir/../print/success

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
    ser=$_dir/cfg/puffer.service
    job=$_dir/cfg/update-node.job
    [ ! -f $job ] && { $_info "Auto update node was already built"; return; }

    # Move service file to /etc/systemd/system/
    # TODO create a new user for nodejs service, using root is very bad
    $_update "Moving service file to /etc/systemd/system"
    [ ! -f $ser ] && { $_error "notfound"; exit 1; }
    sudo mv $ser /etc/systemd/system/  

    # Build the cronjob
    # TODO Make this is own cfg, conf or sh file
    $_update "Building cronjob..."
    echo "systemctl stop puffer" >> $job
    echo "cd $(pwd)/www && npm i" >> $job
    echo "[ \$? -ne 0 ] && { echo '\$(date) :: installing npm packages failed! Did not update website.' >> CRON_ERROR.log; exit 1; }" >> $job
    echo "[ -d /var/www ] && rm -r /var/www" >> $job
    echo "\e[0;32m[*]\e[0m Copying $(pwd) to /var/www" >>$job
    echo "cp -r $(pwd)/www /var/www" >> $job
    echo "sleep 1" >> $job
    echo "systemctl start puffer" >> $job

    # Run the job
    $job

    # Start the webserver
    systemctl start puffer    

    # Move it to /usr/local/bin/ so our cronjob can file it
    sudo mv $job /usr/local/bin/

    # Write a cron job that will call it
    write_cronjob "@daily /usr/local/bin/update-node.job" "root"
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

# Set up cron job for auto git pull
yon "Set up auto git pulls?" && make_auto_pull

# Set up cron job for auto updating the website www files
yon "Set up auto update?" && make_auto_update

# Reset sudo authentication timestamp
sudo -k
