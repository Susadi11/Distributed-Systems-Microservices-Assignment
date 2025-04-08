const httpProxy = require('http-proxy');
const cors = require('cors');
const express = require('express');
const PORT = process.env.PORT || 8000;

const app = express();
const proxy = httpProxy.createProxyServer({});

app.use(express.json());
app.use(cors());

proxy.on('error', (err, req, res) => {
    console.error('Error in proxy',err);
});

app.get('/health', (req, res) => {
    res.status(200).send({
        status: 'API Gateway is up and running'
    });
});

app.listen(PORT, () => {
    console.log(`API Gateway listening on port ${PORT}`);
});