const express = require('express');
const router = express.Router();
const countryController = require('../controllers/countryController');

router.get('/', countryController.getAllCountries);
router.get('/:id', countryController.getCountryById);
router.post('/', express.json(), countryController.addCountry);
router.post('/:id', express.json(), countryController.updateCountry);
router.get('/:id/delete', countryController.deleteCountry);

module.exports = router;
