const bcrypt = require('bcryptjs');
const db = require('../models/databaseConnector')

const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log("Login attempt:", { email }); // Logging login attempt (without password)
      
      if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
      }
      
      // Fetch user from database
      const [rows] = await db.execute('SELECT * FROM tenants WHERE email = ?', [email]);
      
      if (rows.length === 0) {
        return res.status(401).json({ success: false, message: "Invalid email or password" });
      }
      
      const user = rows[0];
      
      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      
     if (!isMatch) {
        // Password incorrect - render login page with error
        return res.render('login', { 
          error: "Invalid email or password",
          email: email // Preserve the email they entered
        });
      }
      
      // Store user data in session - note: using fullName to be consistent
      req.session.user = { 
        id: user.id, 
        fullName: user.fullName,
        email: user.email 
      };
      
      // Explicitly save the session and wait for it to complete
      req.session.save(err => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ success: false, message: "Session error" });
        }
        
        // Log successful login with session ID for debugging
        console.log("User logged in successfully:", {
          userId: user.id,
          fullName: user.fullName,
          sessionID: req.sessionID
        });
        
        // Redirect to home page after successful login
        res.redirect('/');
      });
      
    } catch (err) {
      console.error("Login Error:", err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };




// Handle user registration
const register = async (req, res) => {
    try {
        console.log("Request Body: ", req.body); // Debugging: Check if req.body contains data

        const { fullName, email, password, phoneNumber } = req.body;

        // Validate input
        if (!fullName || !email || !password || !phoneNumber) {
            return res.status(400).send("All fields are required.");
        }

        // Insert into the database
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.execute(
                'INSERT INTO `tenants` (`fullName`, `phoneNumber`, `email`, `password`) VALUES (?, ?, ?, ?)',
                [fullName, phoneNumber, email, hashedPassword]
            );
            console.log('Tenant added successfully!');
            return res.redirect('/login?success=User registered successfully! Redirecting...'); // Redirect after submission
        } catch (err) {
            console.error('Database Insertion Error:', err);
            res.status(500).send('Error adding tenant to database');
        }

    } catch (err) {
        console.error('Server error:', err);
        res.render('register', { error: 'Server error, try again' });
    }
};


// Log Out
const logout = async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send("Logout failed");
        }
        res.redirect('/'); // Redirect to login page after logout
    });
};

//Authentication Middleware
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
      return res.redirect('/login'); // Redirect if not logged in
  }
  next(); // Allow access if authenticated
};

module.exports = {
    register,
    login,
    logout,
    requireAuth,
};