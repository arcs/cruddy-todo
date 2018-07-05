const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((error, id) => {
    items[id] = text;
    let newPath = path.join(exports.dataDir, id + '.txt');
    fs.writeFile(newPath, text, function(error) {
      if (error) {
        callback(error);
      } else {
        callback(null, {id, text});
      }
    });
  });
};

exports.readOne = (id, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, {id: id, text: item});
  }
};

exports.readAll = (callback) => {
  // use fs.readdir on path to get an array of files names
  let path = exports.dataDir;
  fs.readdir(path, (error, items) => {
    if (error) {
      callback(error);
    } else {
      callback(error, items);
    }
  });
  // provide that array to the callback function

  // var data = [];
  // _.each(items, (item, idx) => {
  //   data.push({ id: idx, text: items[idx] });
  // });
  // callback(null, data);
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, {id: id, text: text});
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if(!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`))
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
