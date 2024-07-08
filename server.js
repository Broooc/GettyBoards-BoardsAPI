const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const moodBoardsRouter = require('./routes/moodboards')

const app = express()
app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ limit: '2mb', extended: true }));
app.use(cors({
    origin: true,
    credentials: true,
}))
app.use(express.json())
app.use(cookieParser());
app.use("/boards", moodBoardsRouter)

dotenv.config()

// const port = 7000

// const server = app.listen(port, () => {
//     console.log(`Server is running on port: ${port}`)
//     require('dns').lookup(require('os').hostname(), function (err, add, fam) {
//         console.log('addr: ' + add);
//     })
// })

// process.on('SIGTERM', () => {
//     server.close(() => {
//     })
// });

module.exports = app