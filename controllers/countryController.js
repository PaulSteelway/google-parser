const countryModel = require('../models/countryModel');

const getAllCountries = (req, res) => {
  countryModel.getAllCountries((countries) => {
    res.render('countries', {
      countries,
      currentPage: '/countries/',
      title:"Countries"
  });
  });
};

const getCountryById = (req, res) => {
  const countryId = req.params.id;
  countryModel.getCountryById(countryId, (country) => {
    if (!country) {
      res.status(404).json({ error: 'Country not found' });
    } else {
      res.json(country);
    }
  });
};

const addCountry = (req, res) => {
  const newCountry = req.body;
  // console.log(req.body);
  countryModel.addCountry(newCountry, (result) => {
    if (!result) {
      res.status(500).json({ error: 'Failed to add country' });
    } else {
      res.redirect('/countries/');

        // res.status(201).json({ id: result.id });
    }
  });
};

const updateCountry = (req, res) => {
  const countryId = req.params.id;
  const updatedFields = req.body;

  countryModel.updateCountry(countryId, updatedFields, (success) => {
    if (!success) {
      res.status(500).json({ error: 'Failed to update country' });
    } else {
      res.redirect('/countries');
    }
  });
};

const deleteCountry = (req, res) => {
  const countryId = req.params.id;
  countryModel.deleteCountry(countryId, (success) => {
    if (!success) {
      res.status(404).json({ error: 'Country not found' });
    } else {
      res.redirect('/countries');
    }
  });
};


module.exports = {
  getAllCountries,
  getCountryById,
  addCountry,
  updateCountry,
  deleteCountry
};
