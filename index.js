/// <reference types="typescript" />
const Journal = require("./Journal")
const Context = require("./Context")

Context.configure({logger: new Journal()})
module.exports = Context;