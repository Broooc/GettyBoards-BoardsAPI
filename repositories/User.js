const { admin } = require('../firebaseConnect')

class UserRepository {

    static async getUserData(UID) {

        const user = await (await admin.firestore().collection('users').doc(UID).get()).data()

        if (!user) {
            return null
        }

        return user
    }

    static async addBoardToTheCount(UID) {

        const increment = admin.firestore.FieldValue.increment(1);

        const board_plus_count = await admin.firestore().collection('users').doc(UID).update({ boards_count: increment })

        return board_plus_count
    }

    static async removeBoardFromTheCount(UID) {

        const decrement = admin.firestore.FieldValue.increment(-1);

        const board_minus_count = await admin.firestore().collection('users').doc(UID).update({ boards_count: decrement })

        return board_minus_count
    }
}

module.exports = UserRepository