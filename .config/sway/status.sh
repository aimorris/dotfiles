battery=$(acpi | grep -o '[0-9]*%')
date=$(date "+%A %d/%m/%y %T")

echo "$battery | $date"
