import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 5001;

const parserMiddleware = express.json();
app.use(parserMiddleware);

const availableResolutionsEnum = [
    "P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"
];

let videos: any[] = []

app.get('/hometask_01/api/videos', (req: Request, res: Response) => {
    res.status(200).send(videos);
});

app.post('/hometask_01/api/videos', (req: Request, res: Response) => {
    const { title, author, availableResolutions } = req.body;
    const errors: { message: string; field: string }[] = [];

    if (!title || typeof title !== 'string' || !title.trim()) {
        errors.push({ message: 'Title is required and must be a string', field: 'title' });
    }

    if (!author || typeof author !== 'string' || !author.trim()) {
        errors.push({ message: 'Author is required and must be a string', field: 'author' });
    }

    if (!Array.isArray(availableResolutions) ||
        !availableResolutions.every(r => availableResolutionsEnum.includes(r))) {
        errors.push({ message: 'AvailableResolutions must contain only allowed values', field: 'availableResolutions' });
    }

    if (errors.length > 0) {
        return res.status(400).send({ errorsMessages: errors });
    }

    const newVideo = {
        id: +(new Date()),
        title,
        author,
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date().toISOString(),
        availableResolutions
    };

    videos.push(newVideo);
    res.status(201).send(newVideo);
});

app.delete('/hometask_01/api/testing/all-data', (req, res) => {
    videos.length = 0; // очищає масив відео
    res.sendStatus(204); // повертає статус 204 No Content
});

app.get('/hometask_01/api/videos/:id', (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const video = videos.find(v => Number(v.id) === id)

    if (!video) {
        return res.sendStatus(404)
    }

    return res.status(200).send(video)
})

app.put('/hometask_01/api/videos/:id', (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const video = videos.find(v => v.id === id)

    if (!video) {
        return res.sendStatus(404)
    }

    const { title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate } = req.body
    const errors: { message: string, field: string }[] = []

    // --- Валідація ---
    if (!title || typeof title !== 'string' || title.trim().length < 1 || title.trim().length > 40) {
        errors.push({ message: 'Title is required and must be a string (1-40 chars)', field: 'title' })
    }

    if (!author || typeof author !== 'string' || author.trim().length < 1 || author.trim().length > 20) {
        errors.push({ message: 'Author is required and must be a string (1-20 chars)', field: 'author' })
    }

    if (!Array.isArray(availableResolutions) ||
        !availableResolutions.every(r => availableResolutionsEnum.includes(r))) {
        errors.push({ message: 'AvailableResolutions must contain only allowed values', field: 'availableResolutions' })
    }

    if (typeof canBeDownloaded !== 'boolean') {
        errors.push({ message: 'canBeDownloaded must be boolean', field: 'canBeDownloaded' })
    }

    if (minAgeRestriction !== null && (typeof minAgeRestriction !== 'number' || minAgeRestriction < 1 || minAgeRestriction > 18)) {
        errors.push({ message: 'minAgeRestriction must be number 1–18 or null', field: 'minAgeRestriction' })
    }

    if (publicationDate && isNaN(Date.parse(publicationDate))) {
        errors.push({ message: 'publicationDate must be a valid ISO date', field: 'publicationDate' })
    }

    // --- Якщо є помилки ---
    if (errors.length > 0) {
        return res.status(400).send({ errorsMessages: errors })
    }

    // --- Якщо валідація успішна — оновлюємо ---
    video.title = title
    video.author = author
    video.availableResolutions = availableResolutions
    video.canBeDownloaded = canBeDownloaded
    video.minAgeRestriction = minAgeRestriction
    video.publicationDate = publicationDate

    return res.sendStatus(204)
})

app.delete('/hometask_01/api/videos/:id', (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const videoIndex = videos.findIndex(v => v.id === id)

    if (videoIndex === -1) {
        return res.sendStatus(404)
    }

    videos.splice(videoIndex, 1)
    return res.sendStatus(204)
})




app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
