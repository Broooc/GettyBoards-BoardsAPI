const express = require('express')
const MoodBoardController = require('../controllers/BoardController')
const TokenServices = require('../services/Token')
const router = express.Router()


router.get('/board/:id', MoodBoardController.getMoodBoard)

router.get('/all-boards', TokenServices.checkAccess, MoodBoardController.getAllUsersMoodBoards)

router.post('/new-board', TokenServices.checkAccess, MoodBoardController.createMoodBoard)

router.put('/edit-board/:id', TokenServices.checkAccess, MoodBoardController.editMoodBoard)

router.delete('/delete-board/:id', TokenServices.checkAccess, MoodBoardController.deleteMoodBoard)

router.delete('/delete-all-boards', TokenServices.checkAccess, MoodBoardController.deleteAllBoards)

module.exports = router