
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/test', async (req, res) => {
    const { url, method, headers, body } = req.body;

    try {
        const response = await axios({
            url,
            method,
            headers,
            data: body
        });
        
        res.status(response.status).json({
            status: response.status,
            headers: response.headers,
            data: response.data
        });
    } catch (error) {
        res.status(error.response ? error.response.status : 500).json({
            status: error.response ? error.response.status : 500,
            message: error.message,
            headers: error.response ? error.response.headers : {},
            data: error.response ? error.response.data : {}
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
