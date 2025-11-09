// import { Driver, VehicleFeature } from '../drivers/types/driver';

export const db = {
    "users": [
        {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "role": "admin"
        },
        {
            "id": 2,
            "name": "Maria Ivanova",
            "email": "maria@example.com",
            "role": "user"
        }
    ],
    "posts": [
        {
            "id": 1,
            "title": "Welcome to my blog",
            "content": "This is the first post on this platform!",
            "authorId": 1
        },
        {
            "id": 2,
            "title": "Frontend development tips",
            "content": "React and TypeScript make a great team.",
            "authorId": 2
        }
    ]
}
