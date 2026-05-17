const fs = require('fs');
const path = 'c:\\Users\\Ruboy\\Downloads\\talk-with-lume-main\\src\\routes\\conversation.$topic.tsx';
let content = fs.readFileSync(path, 'utf8');
// Find the second to last occurrence of the pattern to remove the duplicate
const parts = content.split('  );\n}');
if (parts.length > 2) {
    fs.writeFileSync(path, parts.slice(0, -1).join('  );\n}') + '  );\n}', 'utf8');
}
