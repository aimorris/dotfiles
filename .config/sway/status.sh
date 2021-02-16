battery=$(acpi | grep -o '[0-9]*%')
date=$(date "+%A %d/%m/%y %T")
volume=$(amixer -M get Master | grep -o '[0-9]*%')

echo "$volume | $battery | $date"
