var fApp = require('../app.js');
var Joi = require ('@hapi/joi');
var cassandra	= require("cassandra-driver"); 

var ETHEREUM_CLS = require('./ethereum.js');
//var ETHEREUM_CLS = require('./prueba.js');

//GET - Return all contracts in the DB
var query = "";
exports.findAllContracts = function(req, res) {
    query = "SELECT * FROM contracts ";
    
    var itemId = req.params.id;
    if (itemId >0) {
      // console.log('Get ' + req.params.id);
      query += "where id = " + itemId;
    }
    fApp.connection.execute(query, {id:1}, (err, results) => {
        if (err) {
          return res.status(500).send("There was a problem resolving query.");
        }  
        console.log(results.rows);
        res.status(200).send(results.rows);
    });
};
//GET - Return all companies
exports.findAllCompanies = function(req, res) {
    query = "SELECT * FROM companies ";
    fApp.connection.execute(query, (err, results) => {
        if (err) {
          return res.status(500).send("There was a problem resolving query.");
        }  
        console.log(results.rows);
        res.status(200).send(results.rows);
    });
};


//------------------------------------------------------------------------------------------------------

//PUT - Register contracts signed by users in database and Ethereum 
exports.contractsUsers = function(req, res) {   
      console.log(req.body);
      service_id = cassandra.types.uuid();
      console.log(service_id);
      query = "insert into contractsusers2 (id,contract_text,contract_id, date_log, user_ip, user_name, accepted) values (?,?,?,?,?,?,?)"; 
      fApp.connection.execute(
         query,[service_id,req.body.contractText,req.body.contractID,new Date(),req.body.userIP,req.body.userName,req.body.accepted],
        (err, results) => {
          if (err) {
            console.log(err);
            return res.status(500).send("There was a problem resolving query.");
          }  else {
            //registro en Ethereum
            console.log('INI ETHEREUM_CLS');
            ETHEREUM_CLS.registerContractTFM(req.body.contractText, req.body.contractID, req.body.userIP, req.body.accepted, 1691452800 );
            console.log('END ETHEREUM_CLS');
          }
          res.status(200).send(results.rows);
      });

  validate: {
    payload: {
          contractText: Joi.string().required();
          contractID: Joi.string().required();
          userIP: Joi.string();
          userName: Joi.string();
          accepted: Joi.boolean().required()
      }
  }
};

//GET - Obtain signed contracts in Ethereum
exports.getSignedContracts = async function(req, res) {
 try{
  console.log('INI ETHEREUM_CLS');
  resultado = await ETHEREUM_CLS.getContractSignedTFM();
  console.log('END ETHEREUM_CLS');

  res.status(200).send(resultado);
 }  finally{}
};


//------------------------------------------------------------------------------------------------------


