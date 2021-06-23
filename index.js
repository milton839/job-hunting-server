const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const ObjectID = require('mongodb').ObjectID;

require('dotenv').config()

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cf5ms.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const port = process.env.PORT || 4000;

const app = express()
app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Server Testing')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const jobCollection = client.db("jobsHunting").collection("allJobs");
  const candidateCollection = client.db("jobsHunting").collection("applyCandidate");
  const adminCollection = client.db("jobsHunting").collection("admin");
  const employerPremiumCollection = client.db("jobsHunting").collection("premiumEployer");
  const employerStandardCollection = client.db("jobsHunting").collection("StandardEployer");
  const employerBasicCollection = client.db("jobsHunting").collection("basicEployer");

  app.post('/addJob/', (req, res) => {
    const job = req.body;
    console.log(job);
    jobCollection.insertOne(job)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
  })

  app.post('/jobApply/', (req, res) => {
    const jobApply = req.body;
    console.log(jobApply);
    candidateCollection.insertOne(jobApply)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
  })

  app.post('/addAdmin/', (req, res) => {
    const admin = req.body;
    console.log(admin);
    adminCollection.insertOne(admin)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
  })

   app.post('/addEmployerPremium/', (req, res) => {
    const employer = req.body;
    console.log(employer);
    employerPremiumCollection.insertOne(employer)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
  })

  app.post('/addStandardEmployer/', (req, res) => {
    const employer = req.body;
    console.log(employer);
    employerStandardCollection.insertOne(employer)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
  })

  app.post('/addBasicEmployer/', (req, res) => {
    const employer = req.body;
    console.log(employer);
    employerBasicCollection.insertOne(employer)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
  })

  app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email })
        .toArray((err, admin) => {
            res.send(admin.length > 0);
        })
  })

   app.post('/getPremiumEmployer', (req, res) => {
    const email = req.body.email;
    employerPremiumCollection.find({ email: email })
        .toArray((err, admin) => {
            res.send(admin.length > 0);
        })
  })

   app.post('/getStandardEmployer', (req, res) => {
    const pemail = req.body.pemail;
    employerStandardCollection.find({ email: pemail })
        .toArray((err, admin) => {
            res.send(admin.length > 0);
        })
  })

   app.post('/getBasicEmployer', (req, res) => {
    const email = req.body.email;
    employerBasicCollection.find({ email: email })
        .toArray((err, admin) => {
            res.send(admin.length > 0);
        })
  })


  app.get('/jobs',(req,res) => {
    jobCollection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

   app.get('/jobsFilter',(req,res) => {
    const search = req.query.search;
    jobCollection.find({title: {$regex: search}})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.get('/candidate',(req,res) => {
    candidateCollection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

   app.get('/jobListByEmail',(req,res) => {
    jobCollection.find({email:req.query.email})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })


  app.patch('/update/:id',(req,res) => {
      console.log(req.body.jobPostStatus)
      jobCollection.updateOne({_id:ObjectID(req.params.id)},
        {
          $set : {jobPostStatus: req.body.jobPostStatus}
        })
        .then(result => {
          res.send(result.modifiedCount > 0)
        })
    })

  console.log("Database connection");
//   client.close();
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })