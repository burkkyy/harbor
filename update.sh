#!/bin/bash

outpath=/var/www/harbor
config=/etc/nginx/nginx.conf
sites_enabled=/etc/nginx/sites-enabled
sites_available=/etc/nginx/sites-available

# Update html/css/js
echo "[*] Updating $outpath..."
[ -d $outpath ] && rm -r $outpath
cp -r harbor/ $outpath

# Update config file
echo "[*] Updating $config..."
[ -f $config ] && rm $config
cp nginx/nginx.conf $config

# Update sites-enabled
echo "[*] Updating $sites_enabled..."
[ -d $sites_enabled ] && rm -r $sites_enabled
cp -r nginx/sites-enabled/ $sites_enabled

# Update sites-available
echo "[*] Updating $sites_available..."
[ -d $sites_available ] && rm -r $sites_available
cp -r nginx/sites-available/ $sites_available

[ $? -eq 0 ] && echo "[+] Updated successfully." || echo "[!] Update was unsuccessful."

