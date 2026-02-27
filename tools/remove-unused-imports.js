const fs = require('fs');
const path = require('path');

function walk(dir){
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if(stat && stat.isDirectory()) results = results.concat(walk(file));
    else if(/\.jsx?$/.test(file)) results.push(file);
  });
  return results;
}

function removeUnusedImport(src, importName, importSource) {
  // Match: import { ..., importName, ... } from 'importSource';
  const pattern = new RegExp(
    `import\\s+\\{([^}]*)\\}\\s+from\\s+['"]${importSource.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"];?`,
    'g'
  );
  
  let result = src;
  result = result.replace(pattern, (match, names) => {
    const items = names.split(',').map(s => s.trim()).filter(Boolean);
    const keep = items.filter(name => {
      const re = new RegExp('\\b' + name + '\\b', 'g');
      const afterImport = src.substring(src.indexOf(match) + match.length);
      return re.test(afterImport);
    });
    
    if (keep.length === 0) {
      // Remove the entire import line
      return '';
    } else if (keep.length < items.length) {
      return `import { ${keep.join(', ')} } from '${importSource}';`;
    }
    return match;
  });
  
  return result;
}

function processFile(file) {
  let src = fs.readFileSync(file, 'utf8');
  let orig = src;
  
  // Common unused imports from specific packages
  const unusedImports = [
    ['motion', 'framer-motion'],
    ['AnimatePresence', 'framer-motion'],
    ['axios', 'axios'],
    ['useRef', 'react'],
    ['useMemo', 'react'],
    ['useEffect', 'react'],
    ['useCallback', 'react'],
  ];
  
  unusedImports.forEach(([name, source]) => {
    src = removeUnusedImport(src, name, source);
  });
  
  // Clean up extra blank lines from removed imports
  src = src.replace(/\n{3,}/g, '\n\n');
  
  // Remove standalone empty import statements
  src = src.replace(/^import\s*from\s*['"][^'"]*['"];?\s*$/gm, '');
  src = src.replace(/\n{2,}/g, '\n\n');
  
  if (src !== orig) {
    fs.writeFileSync(file, src, 'utf8');
    console.log('Updated', file);
  }
}

const root = path.resolve(__dirname, '..', 'client', 'src');
const files = walk(root);
console.log(`Processing ${files.length} files...`);
files.forEach(processFile);
console.log('Done');
