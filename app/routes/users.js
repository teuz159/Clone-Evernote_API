var express = require('express');
var router = express.Router();
const User = require('../models/user')
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.JWT_TOKEN;

const withAuth = require('../middlewares/auth')

router.post('/register', async(req, res) => {
  const {name, email, password} = req.body
  try {
    const user = await User.create({name, email, password})
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({error: 'Erro ao registrar novo usuário'})
  }
})

router.post('/login', async(req, res) => {
  const {email, password} = req.body;

  try {
    let user = await User.findOne({ email })
    if(!user)
    res.status(401).json({error: 'Email ou senha incorretos'})
    else{
      user.isCorrectPassword(password, function(err, same){
        if(!same)
        res.status(401).json({error: 'Email ou senha incorretos'})
        else{
          const token = jwt.sign({email}, secret, {expiresIn: '30d'});
          res.json({user: user, token: token})
        }
      })
    }
  } catch (error) {
    res.status(500).json({error: "Erro interno, tente novamente"})
  }
})

router.put('/', withAuth, async function(req, res) {
  const { name, email } = req.body;

  try {
    var user = await User.findOneAndUpdate(
      {_id: req.user._id}, 
      { $set: { name: name, email: email}}, 
      { upsert: true, 'new': true }
    )
    res.json(user);
  } catch (error) {
    res.status(401).json({error: error});
  }
});

router.put('/password', withAuth, async function(req, res) {
  const { password } = req.body;

  try {
    var user = await User.findOne({_id: req.user._id})
    user.password = password
    user.save()
    res.json(user);
  } catch (error) {
    res.status(401).json({error: error});
  }
});

//como o usuário está deletando o próprio usuário, não precisa passa o id e nem utilizar um metodo para ele ver se é dono. Através do próprio middleware
// de autenticação ele vai pegar o usuário logado e vai realizar a operação encima do user que tem o token ali logado
// ou seja, só é possível ele fzer uma alteração de um usuário que ele está logado, logo não precisa verificar se ele é dono
router.delete('/', withAuth, async (req, res) => {
  try {
    let user = await User.findOne({_id: req.user._id });
    await user.delete();
    res.json({message: 'OK'}).status(201);
  } catch (error) {
    res.status(500).json({error: error});
  }
})

module.exports = router;
