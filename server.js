// Needed for dotenv
require("dotenv").config();

// Needed for Express
var express = require('express')
var app = express()

// Needed for EJS
app.set('view engine', 'ejs');

// Needed for public directory
app.use(express.static(__dirname + '/public'));

// Needed for parsing form data
app.use(express.json());       
app.use(express.urlencoded({extended: true}));

// Needed for Prisma to connect to database
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

const sportsToUser = {
  'Tennis': ['Jane', 'John'],
  'Pickleball': ['Tim'],
  'Golf' : ['Natalie', 'Joshua'],
  'Surfboarding': ['Elijah']

}
const userProfileData = {
  'Jane': {
    name: 'Jane',
    listings: [
      {
        name: 'Tennis Racket [Renting for 10 months]',
        description: 'Brand: Dunlop CX 200 Tour 18x20',
        imgUrl: '/images/tennis.jpg'
      }
    ],
    testimonials: [
      'good',
      '1 star'
    ]
  }, 
  'John': {
    name: 'John',
    listings: [
      {
        name: 'Tube of balls [Renting for 8 months]',
        imgUrl: '/images/tennis.jpg'
      }
    ]
  },
  'Tim': {
    name: 'Tim',
    listings: [
      {
        name: 'Pickleball paddle (Pro Elongated Control) and 12 balls [Renting for 6 months]',
        imgUrl:'/images/pickleball.jpg'
      }
    ]
  },
  'Natalie': {
    name:'Natalie',
    listings: [
      {
        name: 'Golf clubs and tees [Renting for 6 months]',
        imgUrl:'/images/golfclubs.jpg'
      }
    ]
  },
  'Joshua': {
    name: 'Joshua',
    listings: [
      {
        name: 'Golf putter [Renting for 4 months]',
        imgUrl: 'images/golfputter.jpg'
      }
    ]
  },
  'Elijah': {
    name: 'Elijah',
    listings: [
      {
        name: 'Surfboard [Renting for 1 year]',
        imgUrl: 'images/surfboard.jpg'
      }
    ]
  }
}

// Main landing page
app.get('/', async function(req, res) {

    // Try-Catch for any errors
    try {
        // Get all blog posts
        const blogs = await prisma.post.findMany({
                orderBy: [
                  {
                    id: 'desc'
                  }
                ]
        });


        // Render the homepage with all the blog posts
        await res.render('pages/frontPage', { blogs: blogs });
      } catch (error) {
        res.render('pages/home');
        console.log(error);
      } 
});

// About page
app.get('/about', function(req, res) {
    res.render('pages/about');
});

// Details page
app.get('/detail', function(req, res) {
  res.render('pages/sportDetails');
});

// Profile page
app.get('/profile', function(req, res) {
  const profileName = req.query['name'];
  res.render('pages/zzmonsterProfile', {profileName, userProfileData});
});

// FAQs page
app.get('/faqs',function(req,res) {
  res.render('pages/faqs');
});

// Search page
app.get('/search',function(req,res) {
  res.render('pages/search');
});

// New post page
app.get('/new', function(req, res) {
    res.render('pages/new');
});

app.get('/search_results', function(req, res) {
  const sportName = req.query['sport-name'];
  const location = req.query['location'];
  res.render('pages/search_results', { sportName, location, sportsToUser, userProfileData});
});

// Create a new post
app.post('/new', async function(req, res) {
    
    // Try-Catch for any errors
    try {
        // Get the title and content from submitted form
        const { title, content } = req.body;

        // Reload page if empty title or content
        if (!title || !content) {
            console.log("Unable to create new post, no title or content");
            res.render('pages/new');
        } else {
            // Create post and store in database
            const blog = await prisma.post.create({
                data: { title, content },
            });

            // Redirect back to the homepage
            res.redirect('/');
        }
      } catch (error) {
        console.log(error);
        res.render('pages/new');
      }

});

// Delete a post by id
app.post("/delete/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
        await prisma.post.delete({
            where: { id: parseInt(id) },
        });
      
        // Redirect back to the homepage
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
  });

// Tells the app which port to run on
app.listen(8080);

app.get('/s', function(req, res) {
  res.render('pages/demo');
});
