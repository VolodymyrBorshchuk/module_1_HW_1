import { Request, Response, Router } from 'express';
import { db } from '../../db/in-memory.db';
import { HttpStatus } from '../../core/types/http-statuses';
import { createErrorMessages } from '../../core/utils/error.utils';

export const videosRouter = Router({});

videosRouter
    .get('/', (req: Request, res: Response) => {
        res.status(200).send(db.videos);
    })

    .get('/:id', (req: Request, res: Response) => {
        const id = +req.params.id; // або parseInt(req.params.id)
        const video = db.videos.find(v => v.id === id);

        if (!video) {
            // стандартна структура помилки для тестів
            return res.status(404).send({
                errorsMessages: [
                    { message: 'Video not found', field: 'id' }
                ]
            });
        }

        res.status(200).send(video);
    })

    .post('/', (req, res) => {
    const { title, author, availableResolutions } = req.body;
    if (
        !title ||
        typeof title !== 'string' ||
        !author ||
        typeof author !== 'string' ||
        !Array.isArray(availableResolutions)
    ) {
        return res.status(400).json({
            errorsMessages: [
                { message: 'Invalid input data', field: 'title/author/availableResolutions' },
            ],
        });
    }

    const newVideo = {
        id: Date.now(),
        title,
        author,
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date().toISOString(),
        availableResolutions,
    };

    db.videos.push(newVideo);
    res.status(201).json(newVideo);
})

    .put('/:id', (req: Request, res: Response) => {
        const id = +req.params.id;
        const video = db.videos.find(v => v.id === id);

        // Якщо відео не знайдено
        if (!video) {
            return res.status(404).send({
                errorsMessages: [{ message: 'Video not found', field: 'id' }]
            });
        }

        const { title, author, availableResolutions } = req.body;

        // Валідація
        const errors: { message: string; field: string }[] = [];

        if (!title || typeof title !== 'string' || title.trim().length === 0)
            errors.push({ message: 'Invalid title', field: 'title' });

        if (!author || typeof author !== 'string' || author.trim().length === 0)
            errors.push({ message: 'Invalid author', field: 'author' });

        if (
            !Array.isArray(availableResolutions) ||
            !availableResolutions.every(r =>
                ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160'].includes(r)
            )
        )
            errors.push({ message: 'Invalid availableResolutions', field: 'availableResolutions' });

        if (errors.length > 0) {
            return res.status(400).send({ errorsMessages: errors });
        }

        // Якщо все ок — оновлюємо
        video.title = title;
        video.author = author;
        video.availableResolutions = availableResolutions;

        return res.sendStatus(204); // успішне оновлення без тіла
    })

    .delete('/:id', (req: Request, res: Response) => {
        const id = +req.params.id;
        const index = db.videos.findIndex(v => v.id === id);

        if (index === -1) {
            return res.status(404).send({
                errorsMessages: [{ message: 'Video not found', field: 'id' }]
            });
        }

        db.videos.splice(index, 1);
        return res.sendStatus(204); // Успішне видалення
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
