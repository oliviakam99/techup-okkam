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
  'Pickleball': ['Tim', 'Jane'],
  'Golf' : ['Natalie', 'Joshua'],
  'Surfboarding': ['Elijah','John']

}
const userProfileData = {
  'Jane': {
    name: 'Jane',
    rating: "3/5",
    listings: [
      {
        category: "Tennis",
        name: 'Tennis Racket [Renting for 10 months]',
        description: 'Price: $30, Pickup: Jurong East MRT',
        imgUrl: '/images/tennis.jpg'
      },
      {
        category: "Pickleball",
        name: '12 balls [Renting for 10 months]',
        description: 'Price: $2, Pickup: AMK hub',
        imgUrl: '/images/pickleballtube.jpg'
      },
    ],
    testimonials: [
      'Fast reply.',
      '2 stars'
    ],
    contact: {
      message: 'Contactable via my email or Telegram handle. Available to play together as well!',
      email: 'jane23@gmail.com',
      telegram: 'jane23',
    }
  }, 
  'John': {
    name: 'John',
    rating: "3/5",
    listings: [
      {
        category: "Tennis",
        name: 'Tube of balls (12 balls) [Renting for 8 months]',
        description: 'Price: $1, Pickup: JEM',
        imgUrl: '/images/tennisballtube.jpg'
      
      },
      {
        category: "Surfboarding",
        name: 'Wetsuit (size L) [Renting for 1 year]',
        description: 'Price: $40, Pickup: Tampines MRT',
        imgUrl: '/images/wetsuit.jpg'
      }
    ],
    testimonials: [
      'Efficient service.'
    ],
    contact: {
      message: 'Contactable via my email or Telegram handle',
      email: 'johndoe@gmail.com',
      telegram: 'johndoe'
    }
  },
  'Tim': {
    name: 'Tim',
    rating: '5/5',
    listings: [
      {
        category: "Pickleball",
        name: 'Pickleball paddle (Pro Elongated Control) [Renting for 6 months]',
        description: 'Price: $10, Pickup: Hougang MRT',
        imgUrl:'/images/pickleball.jpg'
      }
    ],
    testimonials: [
      'Great service and very easy to talk to!',
      'Love how good his equipment are. Handy man!'
    ],
    contact: {
      message: 'Contactable via my email or Telegram handle. Available to play together as well!',
      email: 'timmyturner@gmail.com',
      telegram: 'timmyturner',
      
    }
  },
  'Natalie': {
    name:'Natalie',
    rating: "4/5",
    listings: [
      {
        category: "Golf",
        name: 'Golf clubs and tees [Renting for 6 months]',
        description: 'Price: $20, Pickup: ION mall',
        imgUrl:'/images/golfclubs.jpg'
      }
    ],
    testimonials: [
      'Fast reply.',
      '3 stars'
    ],
    contact: {
      message: 'Contactable via my email or Telegram handle',
      email: 'nattobeans@gmail.com',
      telegram: 'nattobeans'
    }
  },
  'Joshua': {
    name: 'Joshua',
    rating: "4/5",
    listings: [
      {
        category: "Golf",
        name: 'Golf putter [Renting for 4 months]',
        description: 'Price: $45, Pickup: Great World City',
        imgUrl: 'images/golfputter.jpg'
      }
    ],
    testimonials: [
      'Great to talk to, good exchange of services.'
    ],
    contact: {
      message: 'Contactable via my email or Telegram handle',
      email: 'joshuatheking@gmail.com',
      telegram: 'joshuatheking'
    }
  },
  'Elijah': {
    name: 'Elijah',
    rating: '2/5',
    listings: [
      {
        category: "Surfboarding",
        name: 'Surfboard [Renting for 1 year]',
        description: 'Price: $40, Pickup: ECP',
        imgUrl: 'images/surfboard.jpg'
      }
    ],
    testimonials: [
      'Still a new user, can be better.'
    ],
    contact: {
      message: 'Contactable via my email or Telegram handle. Looking for a partner to play together as well!',
      email: 'elijah45@gmail.com',
      telegram: 'elijah45'
    }
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
  console.log(sportName)
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
