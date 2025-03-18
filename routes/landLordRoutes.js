const express = require('express')
const router = express.Router()
const { generateProperties } = require('../helpers/property');
const db = require('../models/databaseConnector')
const multer = require('multer');
const path = require('path')

router.use(express.static('public'));  // To serve uploaded images
router.use(express.json());

router.use(express.urlencoded({ extended: true }));
router.use('/uploads', express.static(path.join(__dirname, 'uploads'))); //
db.execute('SELECT 1')
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.error('Database connection failed:', err));



    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, 'public/uploads/'); // Must exist
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
          );
        }
      });
      
      const upload = multer({
        storage: storage,
        limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
        fileFilter: (req, file, cb) => {
          if (file.mimetype.startsWith('image/')) {
            cb(null, true);
          } else {
            cb(new Error('Only image files are allowed!'), false);
          }
        }
      });


// Serve static files (so we can access images from the browser)
router.use('/uploads', express.static('uploads'));




const properties = generateProperties();

router.get('/', (req, res) => {
    res.render('Landlord/Dashboard', { title: "House Me --LandLord Dashboard",  currentRoute: '/Dashboard', properties })
})

router.get('/Landlordproperties', (req, res) => {
    res.render('Landlord/Landlordproperties', { title: "House Me --Manage Properties",  currentRoute: '/Dashboard/Landlordproperties' })
})

router.get('/tenants', (req, res) => {
    res.render('Landlord/Tenants', { title: "House Me --Tenants",  currentRoute: '/Dashboard/tenants' })
})

router.get('/caretaker', (req, res) => {
    res.render('Landlord/caretaker', { title: "House Me --Settings", currentRoute: '/Dashboard/caretaker' })
})

router.get('/LandlordMessages', (req, res) => {
    res.render('Landlord/LandlordMessages', { title: "House Me -- Messages", currentRoute: '/Dashboard/LandlordMessages' })
})

router.get('/LandlordBookings', (req, res) => {
    res.render('landlord/LandlordBookings', { title: "House Me -- Bookings",  currentRoute: '/Dashboard/LandlordBookings' })
})

router.get('/LandlordSettings', async (req, res) => {
   
    try {
      // Get the user ID from the session
      const userId = req.session.user.id;
      
      // Query the database for detailed user information
      const [userRows] = await db.execute(
        'SELECT * FROM tenants WHERE id = ?', 
        [userId]
      );
      
      if (userRows.length === 0) {
        return res.status(404).render('error', { message: 'User not found' });
      }
      
      const userData = userRows[0];
      
     console.log("User is",userData)
     res.render('Landlord/LandlordSettings', { 
      title: "House Me --Settings",  
      currentRoute: '/Dashboard/LandlordSettings',
      info:userData,
     })
      
    } catch (err) {
      console.error('Error fetching user data:', err);
      res.status(500).render('error', { message: 'Server error' });
    }
});


router.get('/addnewProperty', (req, res) => {
    res.render('Landlord/addnewProperty', { title: "House Me --Settings",currentRoute: '/Dashboard/LandlordSettings' })
})

router.get('/addnewCaretaker', (req, res) => {
    res.render('Landlord/addnewCaretaker', { title: "House Me --Settings", currentRoute: '/Dashboard/LandlordSettings' })
})

//Add Carataker
router.post('/caretaker', async (req, res) => {
    console.log('Received Data:', req.body);  // Debugging log

    const { full_name, phone_no, email, locations, date_added } = req.body;


    if (!full_name || !phone_no || !email || !locations || !date_added) {
        return res.status(400).send("All fields are required.");
    }

    try {
        await db.execute(
            'INSERT INTO `caretakers` (`full name`, `phone_no`, `email`,`locations`,`date_added`) VALUES (?, ?, ?,?,?)',
            [full_name, phone_no, email, locations, date_added]
        );
        console.log('Caretaker added successfully!');
        res.redirect('/Dashboard/addnewCaretaker');  // Redirect back after submission
    } catch (err) {
        console.error('Database Insertion Error:', err);
        res.status(500).send('Error adding caretaker to database');
    }
});
//Fetch Caretakers
router.get('/caretakers', async (req, res) => {
    try {
        const [results] = await db.execute(`
            SELECT 
                id,
                \`full name\` AS full_name,
                phone_no,
                email,
                date_added,
                locations
            FROM caretakers
        `);
        res.json(results);
    } catch (err) {
        console.error('Database Fetch Error:', err);
        res.status(500).send('Error retrieving caretakers');
    }
});
// DELETE endpoint
router.delete('/caretakers/:id', async (req, res) => {
    const caretakerId = parseInt(req.params.id, 10);

    if (isNaN(caretakerId)) {
        return res.status(400).json({ error: 'Invalid caretaker ID' });
    }

    try {
        await db.execute('DELETE FROM caretakers WHERE id = ?', [caretakerId]);
        res.status(200).json({ message: 'Caretaker deleted successfully' });
    } catch (err) {
        console.error('Database Deletion Error:', err);
        res.status(500).json({ error: 'Error deleting caretaker' });
    }
});

router.get('/caretakers/count', async (req, res) => {
    try {
        const result = await db.query('SELECT COUNT(*) AS count FROM caretakers');
        // The count is in the first object of the array, so we access it like this:
        const count = result[0][0].count;  // result[0] is the first array, and [0] gets the object with count.
        res.json({ count });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch caretaker count' });
    }
});

// add property
// Modify route to accept file uploads
router.post('/property', upload.single('featured_image'), async (req, res) => {
    // Debugging logs
    console.log('Request File:', req.file);
    console.log('Request Body:', req.body);
  
    const { property_name, bedrooms, bathrooms, kitchens, square_feet, price, status, location, description } = req.body;
    const featured_image = req.file ? req.file.filename : null;
  
    // Validation
    const requiredFields = [
      property_name, bedrooms, bathrooms, kitchens,
      square_feet, price, status, location, description
    ];
  
    if (requiredFields.some(field => !field)) {
      return res.status(400).send("All text fields are required.");
    }
  
    if (!featured_image) {
      return res.status(400).send("Featured image is required.");
    }
  
    try {
      const result = await db.execute(
        'INSERT INTO properties (property_name, bedrooms, bathrooms, kitchens, square_feet, price, status, description, location, featured_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [property_name, bedrooms, bathrooms, kitchens, square_feet, price, status, description, location, featured_image]
      );
      
      res.redirect('/Dashboard/addnewProperty');
    } catch (err) {
      console.error('Database Error:', err);
      res.status(500).send('Server Error: ' + err.message);
    }
  });





module.exports = router