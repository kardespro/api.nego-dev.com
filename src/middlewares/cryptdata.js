const fs = require("node:fs")
const sh = require("sha256")
const u = require("quick.db")
class Cr {
  static _s(text){
    const data = sh(text)
    const fileDir = "../../data/users.txt"
    u.push(`logged`, data)
  }
}

module.exports = Cr;