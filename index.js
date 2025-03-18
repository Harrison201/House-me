const express = require('express')
const app = express()
const path = require('path')
const { engine } = require('express-handlebars');
const LandLordRouting = require('./routes/landLordRoutes');
const AdminRouting = require('./routes/adminRoutes');
const db = require('./models/databaseConnector')
const session = require('express-session');
const AuthController = require('./controllers/auth')
// const hbs = require('hbs'); // Assuming you're using hbs as the Handlebars engine
const { generateProperties } = require('./helpers/property');

//Database connetion
db.execute('SELECT 1')
    .then(() => console.log(''))
    .catch(err => console.error('', err));

//serving fontawesome icons globally
app.use('/fa', express.static(__dirname + '/node_modules/@fortawesome/fontawesome-free'));
// app.set(express.static(path.join(__dirname,'public')))
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars
app.set('view engine', 'hbs');
app.set('view cache', false);
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main.hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
}));

app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON data
app.use(express.json());



//Session Handler
app.use(session({
    secret: 'your_secret_key', // Change this to a strong, random string
    resave: false,
    saveUninitialized: false,
    cookie: { 
        httpOnly: true,
        // secure: true, // Enable in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      }// Set to `true` in production with HTTPS
}));



app.use((req, res, next) => {
  // Make user data available to all templates
  res.locals.user = req.session.user || null;
  res.locals.isAuthenticated = !!req.session.user;
  next();
});


const properties = generateProperties();

module.exports = { properties };

//
app.get('/', (req, res) => {
    res.render('home', { title: "-- Homepage",properties,showheaderFooter:true,})
})

app.get('/location', (req, res) => {
    res.render('location', { title: "-- Locations",showheaderFooter:true})
})

app.get('/properties', (req, res) => {
    res.render('properties', { title: "-- Properties",properties,showheaderFooter:true})
})

app.get('/contact', (req, res) => {
    res.render('contact', { title: "-- Contact" ,showheaderFooter:true})
})

app.get('/login', (req, res) => {
    res.render('login', { title: "-- Login" ,showheaderFooter:false, })
})
app.get('/forgotpassword', (req, res) => {
    res.render('forgotpassword', { title: "-- Login" ,showheaderFooter:false, })
})
app.get('/register', (req, res) => {
  res.render('register', { title: "-- Create Account" ,showheaderFooter:false, })
})


//Authentication Routes
app.post("/login", AuthController.login)
app.post("/logout", AuthController.logout)
app.post('/register',AuthController.register );


app.get('/propertydetail', (req, res) => {
    res.render('propertyDetail', { title: "-- Properties",properties,showheaderFooter:true})
})
// Property details route
app.get('/property/:id', (req, res) => {
    const propertyId = parseInt(req.params.id);
    if (propertyId >= 0 && propertyId < properties.length) {
        res.render('details.hbs', { property: properties[propertyId],showheaderFooter:true});
    } else {
        res.status(404).send('Property not found');
    }
});




//LandLord Routes
const applyLayout = (req, res, next) => {
    res.locals.layout = 'LandLorddashboard'; // Set the layout name
    next();
  };
app.use('/Dashboard',AuthController.requireAuth, applyLayout, LandLordRouting);

//Admin Routes
const applyLayoutAdrmin = (req, res, next) => {
    res.locals.layout = 'AdminDashboard'; // Set the layout name
    next();
  };
app.use('/admin',applyLayoutAdrmin, AdminRouting)









app.listen(3000)