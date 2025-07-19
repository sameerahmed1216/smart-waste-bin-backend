const express = require('express');
const router = express.Router();
const sendEmail = require('../utilities/sendEmail'); // ✅ Email function
const sendSMS = require('../utilities/sendSMS');     // ✅ SMS function

// 📍 Final accurate bin data with coordinates
const bins = [
  {
    id: 1,
    location: "PDA College",
    level: "45%",
    latitude: 17.3151879,
    longitude: 76.8340612,
    lastUpdated: "2025-04-11T10:00:00Z"
  },
  {
    id: 2,
    location: "SVP Circle",
    level: "30%",
    latitude: 17.3191503,
    longitude: 76.8274511,
    lastUpdated: "2025-04-11T10:10:00Z"
  },
  {
    id: 3,
    location: "Mahebas Masjid (Super Market)",
    level: "75%",
    latitude: 17.3405219,
    longitude: 76.8377997,
    lastUpdated: "2025-04-11T10:20:00Z"
  }
];

// GET /api/bins
router.get('/', async (req, res) => {
  try {
    for (const bin of bins) {
      const levelValue = parseInt(bin.level.replace('%', ''));

      // 🔔 Trigger alert if bin level ≥ 70%
      if (levelValue >= 70) {
        // Correctly formatted map URL using backticks (template literal)
        const mapUrl = `https://www.google.com/maps?q=${bin.latitude},${bin.longitude}`;

        // 📩 Message for email + SMS
        const alertMessage = `🚨 Bin Full Alert!
Location: ${bin.location}
Level: ${bin.level}
📍 Map: ${mapUrl}`;

        // ✅ Send Email Alert
        await sendEmail({
          to: 'ssp92392@example.com',  // 👉 Change to your real email
          subject: `🚨 Bin Full Alert - ${bin.location}`,
          text: alertMessage,
        });

        // ✅ Send SMS Alert
        await sendSMS(alertMessage);
      }
    }

    // 🌐 Return bin data as API response
    res.json(bins);
  } catch (error) {
    console.error('❌ Error while sending alerts:', error.message);
    res.status(500).json({ message: 'Server error while sending alerts' });
  }
});

module.exports = router;
