const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const accountsRoutes = require('./routes/accountsRoutes');
const countriesRoutes = require('./routes/countriesRoutes');
const db = require('./db');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'pug');



app.use('/countries',countriesRoutes)
app.use('/', accountsRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
