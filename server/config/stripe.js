const config = require("./main");
module.exports = require("stripe")(config.stripe.api_key);
