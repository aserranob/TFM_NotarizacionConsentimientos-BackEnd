var express = require("express"),
    app = express(),
    http     = require("http"),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override"),
    server   = http.createServer(app),
    cassandra	= require("cassandra-driver"); 
    fConfig = require('./cassandra_config.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());

var router = express.Router();

router.get('/', function(req, res) {
   res.send("Hello World!");
});

app.use(router);

exports.connection = new cassandra.Client(fConfig.dbConfig);

exports.connection.connect(function(err,result){
    if(err) {
        console.log('ERROR: connecting to Database. ' + err);
    }
    app.listen(3000, function() {
        console.log("Node server running on http://localhost:3000");
    });
});

var ContractCtrl = require('./controllers/contracts.js');
// API routes
var contracts = express.Router();
contracts.route('/contracts').get(ContractCtrl.findAllContracts)
contracts.route('/contracts/:id').get(ContractCtrl.findAllContracts)
contracts.route('/companies').get(ContractCtrl.findAllCompanies)
contracts.route('/contractsUsers').post(ContractCtrl.contractsUsers)
contracts.route('/getSignedContracts').get(ContractCtrl.getSignedContracts)

app.use('/api', contracts);

