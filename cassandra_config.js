var cassandra = require("cassandra-driver");
exports.dbConfig = {
    contactPoints : ['127.0.0.1'],
    localDataCenter: 'datacenter1',
    keyspace:'consents'
};
