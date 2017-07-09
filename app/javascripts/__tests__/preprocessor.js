const babelJest = require('babel-jest');

module.exports = {
  process(src, path, config) {
    if (path.endsWith('.scss') || path.endsWith('.css') || path.endsWith('.sass')) {
      return 'module.exports = new Proxy({}, { get: function (target, name) { return name; } });';
    }

    if (path.endsWith('.svg')) {
      const pathArr = path.split('/');
      const iconFileName = pathArr[pathArr.length - 1].replace('.svg', '');
      return `module.exports = "${iconFileName}";`;
    }

    return babelJest.process(src, path, config);
  },
};
