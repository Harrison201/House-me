const express = require('express')
const app = express()
const path = require('path')
const { engine } = require('express-handlebars');
const { title } = require('process');


app.use('/fa', express.static(__dirname + '/node_modules/@fortawesome/fontawesome-free'));
// app.set(express.static(path.join(__dirname,'public')))
app.use(express.static(path.join(__dirname, 'public')));
// Handlebars
app.set('view engine', 'hbs');
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main.hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
}));

// Helper function to generate random apartment titles
const getRandomTitle = () => {
    const titles = [
        "Sunset Paradise Apartments", 
        "Green Valley Estates", 
        "Oceanview Villas", 
        "Highland Meadows", 
        "Cityscape Towers",
        "Palm Grove Residences", 
        "Crystal Bay Suites", 
        "Riverside Retreat",
        "Mountain View Lodge", 
        "The Grand Plaza"
    ];
    // Return a random title from the list
    return titles[Math.floor(Math.random() * titles.length)];
};



   // Sample data array for properties
   const properties = Array.from({ length: 6 }, () => ({
    image: `/images/a${Math.ceil(Math.random() * 6)}.jpg`,
    status: 'Rent',
    price: `Ksh ${((Math.random() * 5) + 1).toFixed(1)}m`,
    title: getRandomTitle(),
    beds: Math.floor(Math.random() * 5) + 1,
    baths: Math.floor(Math.random() * 3) + 1,
    location: '778 Panama City, FL'
}));

app.get('/', (req, res) => {
     
    res.render('home', { title: "-- Homepage",properties })
})
app.get('/location', (req, res) => {
    res.render('location', { title: "-- Locations" })
})
app.get('/properties', (req, res) => {
    res.render('properties', { title: "-- Properties",properties,})
})
app.get('/contact', (req, res) => {
    res.render('contact', { title: "-- Contact" })
})

app.get('/LandlordDashboard', (req, res) => {
    res.render('LandlordDashboard', { title: "-- Dashboard",properties })
})


app.listen(3000)