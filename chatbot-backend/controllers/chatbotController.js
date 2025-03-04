const axios = require('axios');

const generateResponse = async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct',
            { inputs: userMessage },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                },
            }
        );
        res.json({ botResponse: response.data[0].generated_text });
    } catch (error) {
        res.status(500).json({ error: 'Error al generar la respuesta' });
    }
};

module.exports = { generateResponse };