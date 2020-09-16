const express = require('express');
const keys = require('./config/keys');
const stripe = require('stripe')(keys.stripe_secret_key);
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const app = express();
const port = process.env.PORT || 5000;

//Handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Set static folder
app.use(express.static(`${__dirname}/public`));

//Index route
app.get('/', (req, res) => {
  res.render('index', {
    stripe_publishable_key: keys.stripe_publishable_key
  });
});

//Charge Route
app.post('/charge', (req, res) => {
  const amount = 2500;
  stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken
  })
  .then(customer => stripe.charges.create({
    amount,
    description: 'Web Development Ebook',
    currency: 'usd',
    customer: customer.id
  }))
  .then(charge => res.render('success'));
})

app.listen(port, () => {
  console.log('Server started on port: ' + port)
})
