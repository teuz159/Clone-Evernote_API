var express = require('express');
var router = express.Router();
const Note = require('../models/note')
const withAuth = require('../middlewares/auth')

router.post('/', withAuth, async (req, res) => {
    const { title, body } = req.body;
    try {
        let note = new Note({title: title, body: body, author: req.user._id});
        await note.save()
        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({error: 'Erro ao criar uma nota'})
    }
})

// BUSCAR NOTAS POR NOME

router.get('/search', withAuth, async(req, res) => {
    const { query } = req.query
    try {
        let notes = await Note.find({author: req.user._id}).find({ $text: {$search: query} })
        res.json(notes);
    } catch (error) {
        res.status(500).json({error: error})
    }
})

// pegar uma nota especifica de um usuário, mas aqui devemos checar se ele é o dono
// autorização para recurso
router.get('/:id', withAuth, async(req, res) => {
    const {id} = req.params;
    try {
        let note = await Note.findById(id)
        if(isOwner(req.user, note))
            res.json(note)
        else
            res.status(403).json({error: 'Permissão negada'})
    } catch (error) {
        res.status(500).json({error: error})
    }
})

// PEGAR TODAS AS NOTAS
router.get('/', withAuth, async(req, res) => {
    try {
        let note = await Note.find({author: req.user._id})
        res.json(note).status(200)
    } catch (error) {
        res.status(500).json({error: error})
    }
})
// ATUALIZAR NOTA
router.put('/:id', withAuth, async(req, res) => {
    const {title, body} = req.body
    const {id} = req.params
    
    try {
        let note = await Note.findById(id)
        if(isOwner(req.user, note)){
            //geralmente passaria id, mas so pode  sser usado quando nomes são iguais, como é _id ao inves de id, não pode passar
            let note = await Note.findOneAndUpdate({_id: id},
                //informamos apenas os parametros que queremos atualizar com set
                { $set: {title: title, body: body} },
                //deixamos claro que queremos o nova nota
                { upsert: true, 'new': true }
                );

                res.json(note).status(200);
        } else {
            res.status(403).json({error: 'Permissão negada'})
        }
    } catch (error) {
        res.json({error: 'Erro ao atualizar nota'}).status(500)
    }
})
// DELETAR NOTA
router.delete('/:id', withAuth, async(req, res) => {
    const {id} = req.params;
    try {
        let note = await Note.findById(id)
        if(isOwner(req.user, note)){
            await note.delete()
            res.json({message: 'OK'}).status(204);
        } else {
            res.status(500).json({error: 'Permissão negada'})
        }
    } catch (error) {
        res.json({error: 'Erro ao deletar nota'}).status(500)
    }
})

const isOwner = (user, note) => {
    if(JSON.stringify(user._id) == JSON.stringify(note.author._id))
        return true;
    else {
        return false
    }
}

module.exports = router;