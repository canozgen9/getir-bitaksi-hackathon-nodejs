const bodyParser = require("body-parser");
const express = require("express");
const MongoClient = require("mongodb").MongoClient;

const app = express();

const url = "mongodb://dbUser:dbPassword@ds155428.mlab.com:55428/getir-bitaksi-hackathon";


app.use(bodyParser.urlencoded({ extended: false }));

app.post('/searchRecord', (req, res) => {
    const maxCount = req.body.maxCount;
const minCount = req.body.minCount;
const startDate = req.body.startDate;
const endDate = req.body.endDate;

res.writeHead(200, {"Content-Type": "application/json"});

MongoClient.connect(url, function(err, db) {

    var records = [];

    var cursor = db.collection('records').find({"createdAt": {"$gte": new Date(startDate), "$lt": new Date(endDate)}});
    cursor.each(function(err, item) {
        if (item) {
            var sum = 0;
            for (var i = 0; i < item.counts.length ; i++) {
                sum += item.counts[i];
            }

            if (sum >= minCount && sum <= maxCount) {
                records.push({key: item.key, createdAt: item.createdAt, totalCounts: sum});
            }
        }
        else {
            var json = JSON.stringify({
                code: 0,
                msg: "Success",
                records: records
            });
            res.end(json);
        }
    });
    db.close();
});
});

app.listen(3000, () => {
    console.log("Started on http://localhost:3000");
});
