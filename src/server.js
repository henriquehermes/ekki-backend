const express = require('express');
const bodyParser = require('body-parser');

const users = require('./routes/user');
const accounts = require('./routes/account');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/user', users);
app.use('/account', accounts);


app.listen(3000);
