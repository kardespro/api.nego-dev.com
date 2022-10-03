const chalk = require("chalk")
const ch = chalk.hex("#fcba03")
class Logger {
  static _createLogger(options = {}){
    return `${chalk.green(`${options.res.statusCode}`)} ${chalk.green(`${options.req.method}`)} ${ch(`${options.req.headers["x-forwarded-for"]}`)}
 `
  }
}

module.exports = Logger;