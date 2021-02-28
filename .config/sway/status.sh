battery=$(acpi | grep -o '[0-9]*%')
date=$(date "+%A %d/%m/%y %T")
volume=$(amixer -D pulse get Master | grep -o '[0-9]*%' -m 1)
muted=$(amixer -D pulse get Master | tail -1 | grep -c '\[on\]')

if [[ $muted -ne 1 ]]
then
	echo "MUTED | $battery | $date"
else
	echo "$volume | $battery | $date"
fi
