var express = require('express');
var app = express();
var exphbs = require('express-handlebars');
var methodOverride = require('method-override');
var session = require('express-session');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');
var db = require('./helper/database');

//load routes
var games = require('./routes/games');
var users = require('./routes/users');

//load passport
require('./config/passport')(passport);

//connect to mongoose
mongoose.connect("mongodb+srv://HapShapIncorporated:nitsujSHAPPY2298%40%40%28%2A@web-api-for-games-f34dp.mongodb.net/test?retryWrites=true&w=majority",{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(function(){
    console.log('mongodb connected');
}).catch(function(err){
    console.log(err);
});

//require method override
app.use(methodOverride('_method'));

//this code sets up template engine as express handlebars
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

// create application/json parser
app.use(bodyParser.json()); 
// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));

// express session
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}));

//initializes passport
app.use(passport.initialize());
app.use(passport.session());

// Setup for flash messaging
app.use(flash());

// Global Variables for flash messaging
app.use(function(req,res,next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

//get route using express handlebars
app.get('/', function(req, res){
    var title = "Welcome to the Game Library App"
    res.render('index',{
        title:title
    });
});

app.get('/about', function(req, res){
    res.render('about');
});

//use our routes
app.use('/game', games);
app.use('/users', users);

//connects server to port
var port = process.env.PORT || 5000;

//connects server to port
app.listen(port, function(){
    console.log("Server is running on port 5000");
});