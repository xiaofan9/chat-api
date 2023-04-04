const stream = require("stream");
const util = require("util");

// 因为我们的流需要写和读，所以使用双工的stream.Duplex构造
function EventStream() {
  stream.Duplex.call(this); // 构造函数继承
}
util.inherits(EventStream, stream.Duplex); // 原型继承

// 重写_read和_write方法
EventStream.prototype._read = function () { };
EventStream.prototype._write = function () { };

module.exports = EventStream;

// const Readable = require("stream").Readable;

// function RR() {
//   Readable.call(this, arguments);
// }
// RR.prototype = Object.create(Readable.prototype);
// RR.prototype._read = function(data) {};

// module.exports = RR; // require("stream").PassThrough
