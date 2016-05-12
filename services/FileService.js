'use strict';

import fs from 'fs';

const FileService = {

  write(obj) {
    fs.writeFile(obj.filepath, JSON.stringify(obj.data, null, 2), 'utf-8');
  }
};

export default FileService;
