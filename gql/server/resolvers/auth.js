const {gql} = require('apollo-server-express');

const me = () => "Shaswat D Shah";
module.exports = {
    Query: {
        me
    }
}
