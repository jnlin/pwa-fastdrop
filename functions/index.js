const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});

admin.initializeApp();

exports.createClient = functions.https.onRequest(async (req, res) => {
    var db = admin.database();
    const body = req.body;

    if (!body.id) {
        cors (req, res, () => {
            res.status(400).send(req.body);
        });
        return;
    }

    // filter input data
    const data = {
        id: body.id,
        token: body.token,
        lat: body.lat,
        lon: body.lon,
        timestamp: Date.now() / 100
    };
    await db.ref('/clients/' + data.id).set(data);

    var ret = [],
        ref = db.ref('/clients');

    ref.on('value', (snapshot) => {
        const val = snapshot.val();

        for (var i in val) {
          let data = val[i]
          const tm = Date.now()

          if (i === body.id) {
            // 濾掉自己
            continue;
          }

          if (tm - data.timestamp * 100 > 60000) {
              // 濾掉 15 秒沒出現過的 id
              continue;
          }

          ret.unshift({
            id: data.id,
            lat: data.lat,
            lon: data.lon,
            timestamp: data.timestamp
          })
        }
    }, (errorObject) => {
        cors (req, res, () => {
            res.status(500).send('Read failed: ' + errorObject.code);
        });
    });

    cors (req, res, () => {
        res.json(ret);
    });
});
