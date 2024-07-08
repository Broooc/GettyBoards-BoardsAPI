const { Conflict, NotFound, Unauthorized, Forbidden, Badrequest, TooManyRequests } = require('../errors/Errors')
const MoodBoardRepository = require('../repositories/Board')
const moodBoardNameSchema = require('../validators/boardName')
const UserRepository = require('../repositories/User')
const logger = require('firebase-functions/logger')
const { admin } = require('../firebaseConnect')

class MoodBoardServices {
    static async createMoodBoard({ name, photos, createdBy, recentSearches, userId }) {

        try {
            await moodBoardNameSchema.validate({name: name})
        } catch (err) {
            throw new Badrequest("The name is too long")
        }
        
        if (!photos[0]) {
            throw new Badrequest("No images")
        }

        if (photos.length >= 20) {
            throw new Badrequest("Too many images, the limit is 20")
        }

        const userInfo = await UserRepository.getUserData(userId)

        if (userInfo.boards_count >= userInfo.max_boards_count) {
            throw new Forbidden(`You have reached the maximum number (${userInfo.max_boards_count}) of created moodboards`)
        } 

        const createdBoard = await MoodBoardRepository.createMoodBoard({ name, photos, createdBy, recentSearches })

        await UserRepository.addBoardToTheCount(userId)

        return createdBoard
    }
    
    static async findMoodBoard({ mbid }) {

        if (!mbid) {
            throw new Badrequest("ID of moodBoard doesn't passed to request")
        }

        const foundBoard = await MoodBoardRepository.findMoodBoard({ mbid })

        if (!foundBoard) {
            throw new NotFound("MoodBoard with that ID doesn't exists")
        }
        
        return foundBoard
    }

    static async deleteMoodBoard({ mbid, userId }) {

        if (!mbid) {
            throw new Badrequest("ID of moodBoard doesn't passed to request")
        }

        const deletedBoard = await MoodBoardRepository.deleteMoodBoard({ mbid, userId })

        if (!deletedBoard) {
            logger.warn("User tries to delete already deleted board, or this user is not owner of this board", {boardID: mbid, userID: userId})
            throw new NotFound("MoodBoard with that ID doesn't exists")
        }

        await UserRepository.removeBoardFromTheCount(userId)
    }

    static async editMoodBoard({ name, photos, mbid, recentSearches, userId }) {

        try {
            await moodBoardNameSchema.validate({name: name})
        } catch (err) {
            throw new Badrequest("The name is too long")
        }
        
        if (!mbid) {
            throw new Badrequest("ID of moodBoard doesn't passed to request")
        }

        if (!photos[0]) {
            throw new Badrequest("No data")
        }

        if (photos.length >= 20) {
            throw new Badrequest("Too many images, the limit is 20")
        }

        if (!recentSearches) {
            recentSearches = [];
        }

        try {
            const editedBoard = await MoodBoardRepository.editMoodBoard({ name, photos, mbid, recentSearches, userId })
    
            if (!editedBoard) {
                logger.warn("User tries to edit already deleted board, or this user is not owner of this board", {boardID: mbid, userID: userId})
                throw new NotFound("MoodBoard with that ID doesn't exists")
            }
    
            return editedBoard
        } catch (err) {
            if (err.name === 'CastError') {
                throw new Badrequest("Wrong moodboard ID")
            } else {
                throw err.message
            }
        }
    }

    static async findAllBoards({ userId }) {

        if (!userId) {
            throw new Badrequest("Users ID is not defined")
        }

        const allBoards = await MoodBoardRepository.getAllBoards({ userId })

        return allBoards.reverse()
    }

    static async deleteAllBoards({ userId }) {

        if (!userId) {
            throw new Badrequest("No user's ID")
        }
        
        await MoodBoardRepository.deleteAllBoards({ createdBy: userId })
    }

}

module.exports = MoodBoardServices