const express = require("express")
const mongoose = require("mongoose")
const mongoURI = require("./config/keys").mongoURI
const graphqlHTTP = require("express-graphql")
const schema = require("./schema/schema")
const cors = require("cors")

const app = express()

//allow cross origin requests
app.use(cors())

//connect to mongo atlas database
mongoose.connect(mongoURI, {
        useNewUrlParser: true
    })
    .then(() => console.log("MongoDB has connected"))
    .catch(err => console.log(err));

//graphql middleware to handle gql reqs
app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: true
}))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log("Server running on port: " + PORT));