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
        // 濾掉自己
        if (val[data.id]) {
            return;
        }
        ret.unshift(Object.values(val)[0]);
    }, (errorObject) => {
        cors (req, res, () => {
            res.status(500).send('Read failed: ' + errorObject.code);
        });
    });

    cors (req, res, () => {
        res.json(ret);
    });
});
