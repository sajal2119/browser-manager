const express = require('express')
const app = express();
const http = require('http').Server(app);
const childProcess = require('child_process');

const execShellCommandPromise = (cmd) => {
    return new Promise((resolve, reject) => {
        childProcess.exec(cmd, (error, stdout, stderr) => {
            if(error) {
                reject({ msg: "Something went wrong" })
            }
            resolve(stdout? stdout : stderr);
        });
    });
};

app.get('/start', function (req, res) {
    const browser = req.query.browser;
    const url = req.query.url;

    if(!browser || !url) {
        return res.status(400).send('Invalid Parameters');
    }

    childProcess.exec(`open -a "${browser}" ${url}`, (error, stdout, stderr) => {
        if(!error) {
            return res.status(200).send(`Started "${browser}" browser with URL ${url}`);   
        }

        return res.status(500).send(`Something went wrong`);   
    });
});

app.get('/stop', function (req, res) {
    const browser = req.query.browser;
    const url = req.query.url;

    if(!browser) {
        return res.status(400).send('Invalid Parameters');
    }

    childProcess.exec(`pkill -a -i "${browser}"`, (error, stdout, stderr) => {
        if(!error) {
            return res.status(200).send(`Stopped "${browser}" browser`);   
        }

        return res.status(500).send(`Something went wrong`);   
    });
});

app.get('/cleanup', function (req, res) {
    const browser = req.query.browser;

    if(!browser) {
        return res.status(400).send('Invalid Parameters');
    }

    let isFirefox = (browser.toLowerCase() === "firefox")

    execShellCommandPromise(`rm -rf ~/Library/Caches/${isFirefox ? "Mozilla" : "Google/Chrome"}/*`)
    .then(() => {
        if(isFirefox) {
            execShellCommandPromise(`rm -rf ~/Library/Caches/Firefox/* `)
        }
        Promise.resolve()
    })
    .then(() => {
        res.status(200).send(`Cleaned up "${browser}" browser`);   
    })
    .catch(({ msg }) => {
        res.status(500).send(msg);   
    })
});

app.get('/geturl', function (req, res) {
    const browser = req.query.browser;
    const url = req.query.url;

    if(!browser) {
        return res.status(400).send('Invalid Parameters');
    }

    
});

http.listen(3000, function(){
    console.log('Node server started on port 3000');
});
