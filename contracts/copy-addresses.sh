check_file="addresses-local.json"
copy_file="addresses-testnet.json"
if [[ ! -f "$check_file" ]]; then
    echo "$check_file does not exist. Copying $copy_file to $check_file."
    cp $copy_file $check_file
else
    echo "$check_file exists. No file created."
fi
