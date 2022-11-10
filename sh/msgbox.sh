#!/bin/bash
clear
space=""
declare -A color
color=(
    ["--danger"]=41
    ["--success"]=42
    ["--warning"]=43
    ["--info"]=44
)
spacing() {
    i=0
    while [ $i -lt ${#1} ]; do
        space+=" "
        let i+=1;
    done
}
spacing "${1}"
echo -e "\n\033[${color[$2]}m ${space} \033[m\n\033[1;37;${color[$2]}m ${1} \033[m\n\033[${color[$2]}m ${space} \033[m\n"
