const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Connect to MySQL database
const sequelize = new Sequelize('bcdeunhemp3bpu9vsrxs', 'ubzc6qfz3fsdult8', '8ZOmPFyZKaentGLsaRdv', {
  host: 'bcdeunhemp3bpu9vsrxs-mysql.services.clever-cloud.com',
  dialect: 'mysql'
});

// Define model for storing text
const Text = sequelize.define('Text', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

// Synchronize the model with the database
sequelize.sync()
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(err => console.error('Error while syncing the database:', err));

// Middleware
app.use(bodyParser.json());

// Endpoint for saving text
app.post('/api/save', async (req, res) => {
  try {
    const { content } = req.body;
    const newText = await Text.create({ content });
    res.json({ success: true, text: newText });
  } catch (error) {
    console.error('Error saving text:', error);
    res.status(500).json({ success: false, error: 'Failed to save text' });
  }
});

// Endpoint for fetching text
app.get('/api/text', async (req, res) => {
  try {
    const texts = await Text.findAll();
    res.json({ success: true, texts });
  } catch (error) {
    console.error('Error fetching text:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch text' });
  }
});

// Endpoint for deleting text
app.delete('/api/text/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Text.destroy({ where: { id } });
    res.json({ success: true, message: 'Text deleted successfully' });
  } catch (error) {
    console.error('Error deleting text:', error);
    res.status(500).json({ success: false, error: 'Failed to delete text' });
  }
});

// Endpoint for deleting all texts
app.delete('/api/text/all', async (req, res) => {
  try {
    await Text.destroy({ where: {} });
    res.json({ success: true, message: 'All texts deleted successfully' });
  } catch (error) {
    console.error('Error deleting all texts:', error);
    res.status(500).json({ success: false, error: 'Failed to delete all texts' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
