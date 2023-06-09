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

# Printing functions
$_info a
$_update a
$_success a

cfg=$_dir/cfg/build-node.cfg

# Reset sudo authentication timestamp
#sudo -k

# Prompt the user for sudo password
#sudo -v

# Update nodejs
#$_update "Copying www/ to $outpath/"
#[ -d $outpath ] && sudo rm -r $outpath
#sudo cp -r www/ $outpath || exit 1

# Reset sudo authentication timestamp
#sudo -k
