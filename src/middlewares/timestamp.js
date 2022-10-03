const moment = require("moment")
class timestmp {
  static _readTime(time){
   // if(!isNumber(time)) return new Error("'Time' Value is Numerical Value")
    let readed = moment(time).format("LLL")
    return readed
  }
  static _createTimeStamp(){
    return Date.now()
  }
  
}

module.exports = timestmp;