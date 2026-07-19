const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = walkSync(dirFile, filelist);
    } catch (err) {
      if (err.code === 'ENOTDIR' || err.code === 'EBADF') filelist.push(dirFile);
    }
  });
  return filelist;
};

const dirs = [
  path.join(__dirname, 'server'),
  path.join(__dirname, 'client/src')
];

let files = [];
dirs.forEach(dir => {
  files = files.concat(walkSync(dir));
});

files.forEach(file => {
  if (file.endsWith('.js') || file.endsWith('.jsx')) {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content
      .replace(/Blog/g, 'Announcement')
      .replace(/blog/g, 'announcement')
      .replace(/BLOG/g, 'ANNOUNCEMENT');
    
    if (newContent !== content) {
      fs.writeFileSync(file, newContent);
      console.log(`Updated ${file}`);
    }
  }
});
