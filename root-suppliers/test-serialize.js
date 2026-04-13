const { Types } = require('mongoose');
const id = new Types.ObjectId();
const obj = { _id: id };
console.log(JSON.parse(JSON.stringify(obj)));
