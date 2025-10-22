import express, { Request, Response } from 'express';
import 'dotenv/config';
import { videos } from './videos';

const app = express();
const parserMiddleware = express.json();
app.use(parserMiddleware);

const availableResolutionsEnum = [
    "P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"
];

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.get('/api/videos', (req: Request, res: Response) => {
    res.status(200).send(videos);
});

app.post('/api/videos', (req: Request, res: Response) => {
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

app.listen(process.env.PORT || 3000, () => {
    console.log(`Example app listening on port ${process.env.PORT}`);
});
