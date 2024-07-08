const Yup = require('yup')

const moodBoardNameSchema = Yup.object().shape({
    name: Yup.string()
    .max(50, "The name is too long")
})

module.exports = moodBoardNameSchema