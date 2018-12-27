const path = require('path');
const fs = require('fs-extra');

(async () => {
  let dir = path.resolve(__dirname, 'source/_posts/');
  let arr = await fs.readdir(dir);

  arr.forEach(async (filePath) => {
    let content = await fs.readFile(path.resolve(dir, filePath), 'utf8');
    content = content.replace(/^[\n\s]*-{3,}/, '');

    let [header, ...rest] = content.split(/---/);
    let body = rest.join('---');

    if (/\ndescription\s*:([^\n]+)/.test(header)) {
      if (/<!--\s*more\s*-->/.test(body)) {
        console.info('skip ', filePath);
      } else {
        header = header.replace(/\ndescription\s*:([^\n]+)/, '');
        body = `
---

${RegExp.$1.trim().replace(/^["'](.*)["']$/, '$1')}
<!-- more -->

${body}
`;
      }

      fs.writeFile(path.resolve(dir, filePath), `---\n${header}\n${body}`);
    }
  });
})();
