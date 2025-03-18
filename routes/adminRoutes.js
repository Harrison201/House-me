const express = require('express');

const router = express.Router()

router.get('/',(req,res) => {
    res.render('admin/adminDashboard',{title:"House Me  --Admin Dashboard",})
})

router.get('/users',(req,res) => {
    res.render('admin/users',{title:"House Me Users  --Admin Dashboard",})
});

router.get('/notifications',(req,res) => {
    res.render('admin/notifications',{title:"House Me Users  --Admin Dashboard", })
});

router.get('/landlords',(req,res) => {
    res.render('admin/landlords',{title:"House Me Users  --Admin Dashboard", })
});

router.get('/caretaker',(req,res) => {
    res.render('admin/caretaker',{title:"House Me Users  --Admin Dashboard", })
});

router.get('/properties',(req,res) => {
    res.render('admin/properties',{title:"House Me Users  --Admin Dashboard", })
});

router.get('/messages',(req,res) => {
    res.render('admin/messages',{title:"House Me Users  --Admin Dashboard", })
});

router.get('/uploads',(req,res) => {
    res.render('admin/alluploads',{title:"House Me Users  --Admin Dashboard",})
});

router.get('/settings',(req,res) => {
    res.render('admin/settings',{title:"House Me Users  --Admin Dashboard",})
});





module.exports = router