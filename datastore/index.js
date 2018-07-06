const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const promise = require('bluebird');

const promiseRead = promise.promisify(fs.readFile);

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((error, id) => {
    // items[id] = text;
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
  // read the contents of the file and provide it to the callback function
  let newPath = path.join(exports.dataDir, id + '.txt');
  fs.readFile(newPath, (error, data) => {
    if (error) {
      callback(error);
    } else {
      callback(null, {id, text: data.toString()});
    }
  });
};

exports.readAll = (callback) => {
  let newPath = exports.dataDir;
  fs.readdir(newPath, (error, items) => {
    if (error) {
      callback(error);
    } else {
      // loop through each file in the array and replace it with the message object
      let messages = items.map(item => {
        let newPath = path.join(exports.dataDir, item);
        return promiseRead(newPath, (error, data) => {
          return data;
        });
      });
      let results = [];
      promise.all(messages).then(messages => {
        for (let message of messages) {
          console.log(message.toString());
          let obj = {id: '0', text: message.toString()};
          results.push(obj);
        }
        console.log(results)
        callback(error, results);
        // let obj = {id: '0', text: message.toString()}
        // console.log(obj);
        // results.push(obj);
      });
      // var results = [];
      // promise.all(messages, (message) => {
      //   console.log(message);
      //   results.push(message);
      // }).then(() => {
      //   callback(error, results);
      // });
    }
  });
  // var data = [];
  // _.each(items, (item, idx) => {
  //   data.push({ id: idx, text: items[idx] });
  // });
  // callback(null, data);
};

exports.update = (id, text, callback) => {
  let newPath = path.join(exports.dataDir, id + '.txt');
  fs.access(newPath, (error) => {
    if (error) {
      callback(error);
    } else {
      fs.writeFile(newPath, text, (error) => {
        if (error) {
          callback(error);
        } else {
          callback(null, {id, text});
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  let newPath = path.join(exports.dataDir, id + '.txt');
  fs.unlink(newPath, (error) => {
    if (error) {
      callback(error);
    } else {
      callback(null);
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
