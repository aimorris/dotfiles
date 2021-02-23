battery=$(acpi | grep -o '[0-9]*%')
date=$(date "+%A %d/%m/%y %T")
volume=$(amixer -M get Master | grep -o '[0-9]*%')
muted=$(amixer -M get Master | tail -2 | grep -c '\[on\]')

if [[ $muted -ne 1 ]]
then
	echo "MUTED | $battery | $date"
else
	echo "$volume | $battery | $date"
fi
