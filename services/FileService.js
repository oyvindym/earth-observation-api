'use strict';

import fs from 'fs';

const FileService = {

  outputFolder: `${__dirname}/../outputs/`,

  getFilepath(obj) {
    return `${this.outputFolder}/${obj.location}_${obj.endpoint}.json`;
  },

  write(obj) {
    fs.writeFile(this.getFilepath(obj), JSON.stringify(obj.data, null, 2), 'utf-8');
  }
};

export default FileService;
