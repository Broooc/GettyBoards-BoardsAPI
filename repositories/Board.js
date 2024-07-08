const { admin } = require('../firebaseConnect')

class MoodBoardRepository {

    static async createMoodBoard({ name, photos, createdBy, recentSearches }) {

        const firebaseBoard = await admin.firestore().collection('moodboards').add({ name, photos, created_by: createdBy, recentSearches })

        return { _id: firebaseBoard.id }
    }

    static async findMoodBoard({ mbid }) {

        const firebaseBoard = await (await admin.firestore().collection('moodboards').doc(mbid).get()).data()

        firebaseBoard._id = mbid

        if (!firebaseBoard) {
            return null
        }

        return firebaseBoard
    }

    static async editMoodBoard({ name, photos, mbid, recentSearches, userId }) {

        const update = { name: name, photos: photos, recentSearches: recentSearches }

        const firebaseBoard = await admin.firestore().collection('moodboards').doc(mbid)

        const boardData = await (await firebaseBoard.get()).data()

        if (boardData.created_by !== userId) {
            return null
        }

        await firebaseBoard.update(update)
        
        return { _id: mbid }
    }

    static async deleteMoodBoard({ mbid, userId }) {

        const firebaseBoard = await admin.firestore().collection('moodboards').doc(mbid)

        const boardData = await (await firebaseBoard.get()).data()

        if (boardData.created_by !== userId) {
            return null
        }

        const deletedBoard = await firebaseBoard.delete()

        return deletedBoard
        
    }

    static async deleteAllBoards({ createdBy }) {

        const querySnapshot = await admin.firestore().collection('moodboards').where('created_by', '==', createdBy).get()
        
        if (querySnapshot.empty) {
            return [];
        }

        let deletedCount = 0;
    
        const batch = admin.firestore().batch()

        querySnapshot.forEach(doc => {
            batch.delete(doc.ref);
            deletedCount += 1;
        });

        await batch.commit();

        return deletedCount

    }

    static async getAllBoards({ userId }) {

        const querySnapshot = await admin.firestore().collection('moodboards').where('created_by', '==', userId).get()
        
        if (querySnapshot.empty) {
            return [];
        }

        let allBoards = [];
    
        querySnapshot.forEach(doc => {
            let boardData = doc.data();
            boardData._id = doc.id
            allBoards.push(boardData)
        });

        return allBoards

    }
}

module.exports = MoodBoardRepository