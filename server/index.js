const express = require('express');

require('dotenv').config();
const cors = require('cors');

const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');

const app = express();

const PORT = process.env.PORT || 8000;

const connectDB = require('./db');

app.use(cors());

connectDB();

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: process.env.NODE_ENV === 'development'
}));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 