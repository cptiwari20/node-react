const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser')

const keys = require('./config/keys')

require('./models/User')
require('./services/passport');

mongoose.connect(keys.mongoURI);
const app = express();
app.use(bodyParser.json())

app.use( 
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
);
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/paymentRoutes')(app);

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendfile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
};

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server has been start on Port: ${port}`);
});