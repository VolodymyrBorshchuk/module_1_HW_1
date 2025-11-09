import { Request, Response, Router } from 'express';
import { db } from '../../db/in-memory.db';
import { HttpStatus } from '../../core/types/http-statuses';
import { createErrorMessages } from '../../core/utils/error.utils';

export const videosRouter = Router({});

videosRouter
    .get('/', (req: Request, res: Response) => {
        res.status(200).send(db.videos);
    })

    .post('/', (req, res) => {
    const { title, author, availableResolutions } = req.body;

    // Простенька валідація
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
});


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
