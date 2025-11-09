import { Request, Response, Router } from 'express';
import { db } from '../../db/in-memory.db';
import { HttpStatus } from '../../core/types/http-statuses';
import { createErrorMessages } from '../../core/utils/error.utils';
import { Video } from "../../types/video";

export const videosRouter = Router({});

videosRouter
.get('/', (req: Request, res: Response) => {
    res.status(200).send(db.videos);
})

// GET /videos/:id — повертає відео по ID
.get('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const video = db.videos.find((v) => v.id === id);

    if (!video) {
        return res.status(404).send({ error: { code: 404, message: "The page could not be found" } });
    }

    res.status(200).send(video);
})

// POST /videos — створює нове відео
.post('/', (req: Request, res: Response) => {
    const { title, author, availableResolutions } = req.body;

    const errors = [];
    if (!title) errors.push({ message: "Title is required", field: "title" });
    if (!author) errors.push({ message: "Author is required", field: "author" });

    if (errors.length > 0) {
        return res.status(400).send({ errorsMessages: errors });
    }

    const newVideo: Video = {
        id: db.videos.length + 1,
        title,
        author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date().toISOString(),
        availableResolutions: availableResolutions || [],
    };

    db.videos.push(newVideo);
    res.status(201).send(newVideo);
})

// PUT /videos/:id — оновлює відео по ID
.put('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const videoIndex = db.videos.findIndex((v) => v.id === id);

    if (videoIndex === -1) {
        return res.status(404).send({ error: { code: 404, message: "The page could not be found" } });
    }

    const { title, author, availableResolutions } = req.body;
    const errors = [];
    if (!title) errors.push({ message: "Title is required", field: "title" });
    if (!author) errors.push({ message: "Author is required", field: "author" });

    if (errors.length > 0) {
        return res.status(400).send({ errorsMessages: errors });
    }

    const video = db.videos[videoIndex];
    video.title = title;
    video.author = author;
    video.availableResolutions = availableResolutions || [];

    res.sendStatus(204);
})

// DELETE /videos/:id — видаляє відео по ID
.delete('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const videoIndex = db.videos.findIndex((v) => v.id === id);

    if (videoIndex === -1) {
        return res.status(404).send({ error: { code: 404, message: "The page could not be found" } });
    }

    db.videos.splice(videoIndex, 1);
    res.sendStatus(204);
})


// .get('/:id', (req: Request, res: Response) => {
    //     const id = +req.params.id;
    //     const video = db.videos.find(v => v.id === id);
    //     if (!video) {
    //         res.status(HttpStatus.NotFound).send(
    //             createErrorMessages([{ field: 'id', message: 'Video not found' }])
    //         );
    //         return;
    //     }
    //     res.status(200).send(video);
    // })
    //
    // .post('/', (req: Request, res: Response) => {
    //     const errors = vehicleInputDtoValidation(req.body);
    //     if (errors.length > 0) {
    //         res.status(HttpStatus.BadRequest).send(createErrorMessages(errors));
    //         return;
    //     }
    //
    //     const newVideo = {
    //         id: new Date().getTime(),
    //         title: req.body.title,
    //         author: req.body.author,
    //         availableResolutions: req.body.availableResolutions,
    //         createdAt: new Date().toISOString(),
    //     };
    //
    //     db.videos.push(newVideo);
    //     res.status(HttpStatus.Created).send(newVideo);
    // })
    //
    // .put('/:id', (req: Request, res: Response) => {
    //     const id = +req.params.id;
    //     const video = db.videos.find(v => v.id === id);
    //     if (!video) {
    //         res.status(HttpStatus.NotFound).send(
    //             createErrorMessages([{ field: 'id', message: 'Video not found' }])
    //         );
    //         return;
    //     }
    //     Object.assign(video, req.body);
    //     res.sendStatus(HttpStatus.NoContent);
    // })
    //
    // .delete('/:id', (req: Request, res: Response) => {
    //     const id = +req.params.id;
    //     const index = db.videos.findIndex(v => v.id === id);
    //     if (index === -1) {
    //         res.status(HttpStatus.NotFound).send(
    //             createErrorMessages([{ field: 'id', message: 'Video not found' }])
    //         );
    //         return;
    //     }
    //     db.videos.splice(index, 1);
    //     res.sendStatus(HttpStatus.NoContent);
    // });
