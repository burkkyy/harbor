#!/bin/bash

outpath=/var/www/harbor
config=/etc/nginx/nginx.conf
sites_enabled=/etc/nginx/sites-enabled
sites_available=/etc/nginx/sites-available

if [ $(id -u) -ne 0 ]; then echo "[!] Not running as root!">&2; exit 1; fi

# Update html/css/js
echo "[*] Updating $outpath..."
[ -d $outpath ] && rm -r $outpath
cp -r harbor/ $outpath || exit 1

# Update config file
echo "[*] Updating $config..."
[ -f $config ] && rm $config
cp nginx/nginx.conf $config || exit 1

# Update sites-enabled
echo "[*] Updating $sites_enabled..."
[ -d $sites_enabled ] && rm -r $sites_enabled
cp -r nginx/sites-enabled/ $sites_enabled || exit 1

# Update sites-available
echo "[*] Updating $sites_available..."
[ -d $sites_available ] && rm -r $sites_available
cp -r nginx/sites-available/ $sites_available || exit 1

# Check if nginx.conf is correct
[ $((nginx -t)) -eq 0 ] && echo "[+] Updated successfully." || echo "[!] Update was unsuccessful."

# Reload nginx
echo "[-] Reloading nginx..."
nginx -s reload

