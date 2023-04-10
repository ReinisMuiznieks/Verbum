const asyncHandler = require('express-async-handler')
const Answer = require('../models/answerModel')
const router = require('express')

//Get Answer(s)
const getAnswers = asyncHandler(async (req,res) =>{
    Answer.find().then(data => {
        res.json(data)
    }).catch(e => {
        res.json({ message: e })
    })
})

//GET Answer by answerID
const getAnswer = asyncHandler(async (req,res) =>{
    try {
        Answer.find({ _id: req.params.id }).then(data => {
            res.json(data)
        })
    } catch (err) {
        res.json({ message: err });
    }
});

const addAnswer = asyncHandler(async (req,res) =>{
    const answer = new Answer({
        question: req.body.question,
        answer: req.body.answer,
        isCorrect: req.body.isCorrect,
    })
    answer.save().then(data => {
        res.json(data)
    }).catch(e => {
        res.json({ message: e })
    })
})

// router.patch('/:id', (req, resp) => {
//     Test.updateOne({ _id: req.params.id }, {
//         $set: {
//             testname: req.body.testname,
//             passGrade: req.body.passGrade,
//             time: req.body.time,
//         }
//     }).then(data => {
//         resp.json(data)
//     }).catch(e => {
//         resp.json({ message: e })
//     })
// })

const deleteAnswer = asyncHandler(async (req,res) =>{
    Answer.deleteOne({ _id: req.params.id })
        .then(data => {
            res.json(data)
        }).catch(e => {
            res.json({ message: e })
        })
})

module.exports = {
    getAnswer,
    getAnswers,
    addAnswer,
    deleteAnswer,
}
