import fs from "fs"

const packageJsonPath = "package.json";

fs.readFile(packageJsonPath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading package.json:', err);
        return;
    }

    let packageJson;
    try {
        packageJson = JSON.parse(data);
    } catch (parseErr) {
        console.error('Error parsing package.json:', parseErr);
        return;
    }

    delete packageJson.devDependencies;

    fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8', (writeErr) => {
        if (writeErr) {
            console.error('Error writing package.json:', writeErr);
            return;
        }

        console.log('devDependencies removed successfully.');
    });
});