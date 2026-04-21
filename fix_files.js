const fs = require('fs');
const path = require('path');

const baseDir = path.join('c:', 'Users', 'ajst1', 'Phantom', 'PhantomFrame');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(filePath));
        } else {
            if (filePath.endsWith('.js') || filePath.endsWith('.css')) {
                results.push(filePath);
            }
        }
    });
    return results;
}

const files = walk(baseDir);

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    let start = -1;
    let end = -1;
    
    if (content.includes('"""')) {
        start = content.indexOf('"""');
        end = content.lastIndexOf('"""');
        if (start !== end && start !== -1) {
            start += 3;
        }
    } else if (content.includes('"" "')) {
        start = content.indexOf('"" "');
        end = content.lastIndexOf('"" "');
        if (start !== end && start !== -1) {
            start += 4;
        }
    }
    
    if (start !== -1 && end !== -1 && start < end) {
        let prefix = content.substring(0, start - 3);
        if (prefix.includes('=') || prefix.includes('with open')) {
            let actualCode = content.substring(start, end);
            if (actualCode.startsWith('\n')) {
                actualCode = actualCode.substring(1);
            }
            if (actualCode.startsWith('\r\n')) {
                actualCode = actualCode.substring(2);
            }
            fs.writeFileSync(file, actualCode, 'utf8');
            console.log(`Fixed ${file}`);
        }
    }
});
