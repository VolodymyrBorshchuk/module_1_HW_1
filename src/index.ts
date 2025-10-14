import express, {Request, Response} from 'express';

// создание приложения
const app = express();

// порт приложения
const PORT = process.env.PORT || 5001;

const parserMiddleware = express.json();
app.use(parserMiddleware);

app.get("/", (req, res) => {
    res.send("Hello World!");
})





// запуск приложения
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});