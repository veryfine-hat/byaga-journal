/// <reference types="typescript" />
const Journal = require("./Journal")
const Context = require("./context")

Context.configure({logger: new Journal()})
module.exports = Context;