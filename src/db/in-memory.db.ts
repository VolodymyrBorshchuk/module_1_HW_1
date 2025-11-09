// src/db/db.ts
import { Video } from '../types/video';

export const db = {
    videos: <Video[]>[
        {
            id: 1,
            title: 'Introduction to TypeScript',
            author: 'John Doe',
            canBeDownloaded: true,
            minAgeRestriction: null,
            createdAt: new Date().toISOString(),
            publicationDate: new Date().toISOString(),
            availableResolutions: ['P144', 'P720'],
        },
        {
            id: 2,
            title: 'Node.js Basics',
            author: 'Jane Smith',
            canBeDownloaded: false,
            minAgeRestriction: 16,
            createdAt: new Date().toISOString(),
            publicationDate: new Date().toISOString(),
            availableResolutions: ['P240', 'P360'],
        },
    ],
};
