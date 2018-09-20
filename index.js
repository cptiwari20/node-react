const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser')

// requiring some addition files
require('./models/User');
require('./models/Survey');
require('./services/passport');

const keys = require('./config/keys')

// Middlewares
mongoose.connect(keys.mongoURI, { useNewUrlParser: true });
const app = express();
app.use(bodyParser.json());

app.use( 
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
require('./routes/authRoutes')(app);
require('./routes/paymentRoutes')(app);
require('./routes/surveyRoutes')(app);


// Production routes
if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));
    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
};

// Hosting port
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server has been start on Port: ${port}`);
});