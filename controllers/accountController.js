const accountModel = require('../models/accountModel');
const countryModel = require('../models/countryModel');
const signIn = require('../test');
const logIn = require('../session');
const getAllAccounts = (req, res) => {
  countryModel.getAllCountries((countries)=>{
    if (!countries || countries.length<1){
        res.redirect('/countries');
    }
    const CountryArray = countries.map(country => ({ id: country.id, name: country.name }));
    accountModel.getAllAccounts((accounts) => {
        // console.log(accounts)
        res.render('accounts', {
            accounts,
            countries:CountryArray,
            currentPage: '/',
            title:"Accounts"
        });
      });  
  });
  
};

const getAccountById = (req, res) => {
  const accountId = req.params.id;
  accountModel.getAccountById(accountId, (account) => {
    if (!account) {
      res.status(404).json({ error: 'Account not found' });
    } else {
      res.json(account);
    }
  });
};

const addAccount = (req, res) => {
  const newAccount = req.body;
  accountModel.addAccount(newAccount, (result) => {
    if (!result) {
      res.status(500).json({ error: 'Failed to add account' });
    } else {
        res.redirect('/');
    }
  });
};

const updateAccount = (req, res) => {
    const accountId = req.params.id;
    const updatedFields = req.body;
  
    accountModel.updateAccount(accountId, updatedFields, (success) => {
      if (!success) {
        res.status(500).json({ error: 'Failed to update account' });
      } else {
        res.redirect('/');
      }
    });
  };

const deleteAccount = (req, res) => {
  const accountId = req.params.id;
  accountModel.deleteAccount(accountId, (success) => {
    if (!success) {
      res.status(404).json({ error: 'Account not found' });
    } else {
        res.redirect('/');
    }
  });
};
const registerAccount = (req,res)=>{
    const accountId = req.params.id
    accountModel.getCountryAccountById(accountId, (account) => {
        if (!account) {
          res.status(404).json({ error: 'Account not found' });
        } else {
            signIn(account)
            res.redirect('/') // 1 секунда      
        }
      });
    
}
const startAccount = (req,res)=>{
    const accountId = req.params.id
    accountModel.getCountryAccountById(accountId, (account) => {
        if (!account) {
          res.status(404).json({ error: 'Account not found' });
        } else {
            logIn(account)
            res.redirect('/') // 1 секунда      
        }
      });
    
}
module.exports = {
  getAllAccounts,
  getAccountById,
  addAccount,
  updateAccount,
  deleteAccount,
  registerAccount,
  startAccount
};
