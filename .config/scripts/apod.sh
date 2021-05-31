#!/bin/bash

# Image in ~/.apodwallpaper 
FILENAME=apodwallpaper
APODWALLPAPER=${HOME}/.${FILENAME}

rm -rf  ${APODWALLPAPER}
mkdir -p ${APODWALLPAPER} && cd ${APODWALLPAPER}

# download image from apod site
wget -A.jpg -r -l1 --no-parent -nH https://apod.nasa.gov/apod/astropix.html

# move image from obscure folder to main folder, rename image
find ./apod -name "*.gif" -or -name "*.jpg" | while read line ; do
mv "$line" "${FILENAME}.jpg"
done

# Set as wallpaper
feh --bg-fill "${APODWALLPAPER}/${FILENAME}.jpg"

#get rid of cruft
rm -rf apod robots.txt robots.txt.tmp
