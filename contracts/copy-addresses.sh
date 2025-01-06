check_file="addresses-local.json"
copy_file="addresses-local.json"
if [[ ! -f "$check_file" ]]; then
    echo "$check_file does not exist. Copying $copy_file to $check_file."
    touch "$target_file"
else
    echo "$check_file exists. No file created."
fi
