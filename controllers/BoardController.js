const { ErrorUtils } = require('../errors/Errors')
const MoodBoardServices = require('../services/MoodBoard')


class MoodBoardController {
    static async createMoodBoard(req, res) {

        const { name, photos, createdBy, recentSearches } = req.body;

        const userId = req.user.uid;

        try {
            const createdBoard = await MoodBoardServices.createMoodBoard({ name, photos, createdBy, recentSearches, userId })
            return res.status(201).json(createdBoard)
        } catch (err) {
            return ErrorUtils.catchError(res, err)
        }
    }

    static async editMoodBoard(req, res) {

        const { name, photos, recentSearches } = req.body;

        const mbid = req.params.id

        const userId = req.user.uid

        try {
            const editedBoard = await MoodBoardServices.editMoodBoard({ name, photos, mbid, recentSearches, userId })
            return res.status(200).json(editedBoard)
        } catch (err) {
            return ErrorUtils.catchError(res, err)
        }
        
    }

    static async deleteMoodBoard(req, res) {

        const mbid = req.params.id

        try {
            await MoodBoardServices.deleteMoodBoard({ mbid, userId: req.user.uid })
            return res.status(200).json({message: "Board deleted succesfully"})
        } catch (err) {
            return ErrorUtils.catchError(res, err)
        }

    }

    static async getMoodBoard(req, res) {
        
        const mbid = req.params.id

        try {
            const foundBoard = await MoodBoardServices.findMoodBoard({ mbid })
            return res.status(200).json(foundBoard)
        } catch (err) {
            return ErrorUtils.catchError(res, err)
        }
    }

    static async getAllUsersMoodBoards(req, res) {

        const userId = req.user.uid

        try {
            const allUsersBoards = await MoodBoardServices.findAllBoards({ userId })
            return res.status(200).json(allUsersBoards)
        } catch (err) {
            return ErrorUtils.catchError(res, err)
        }

    }

    static async deleteAllBoards(req, res) {
        
        const userId = req.user.uid

        try {
            await MoodBoardServices.deleteAllBoards({ userId })
            return res.status(200).json({message: "All Boards deleted succesfully"})
        } catch (err) {
            return ErrorUtils.catchError(res, err)
        }
    }
}

module.exports = MoodBoardController