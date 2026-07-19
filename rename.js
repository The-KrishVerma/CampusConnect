const fs = require('fs');
const files = [
  'server/controllers/adminController.js',
  'server/controllers/announcementController.js',
  'server/routes/adminRoutes.js',
  'server/routes/announcementRoutes.js',
  'server/server.js'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/Blog/g, 'Announcement');
    content = content.replace(/blog/g, 'announcement');
    // For specific cases like folder /blogs
    content = content.replace(/\/announcementss/g, '/announcements');
    fs.writeFileSync(file, content);
  }
});
