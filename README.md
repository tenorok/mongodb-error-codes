# Errors codes of MongoDB

Errors codes of MongoDB for JS-projects with TS-definitions.

## Installation

```sh
npm install mongodb-error-codes --save
```

Versions of this package matches to the version of [MongoDB](https://github.com/mongodb/mongo) for explicit consistency.

## Use

Example with [Mongoose error handling](https://mongoosejs.com/docs/middleware.html#error-handling-middleware):
```ts
import { MongoError as MongoErrorNative } from 'mongodb';
import type { NativeError, CallbackError } from 'mongoose';
import { MongoError } from 'mongodb-error-codes';

function isMongoError(err: Error): err is MongoErrorNative {
    return err instanceof MongoErrorNative;
}

schema.post<IDoc>('save', (err: NativeError, _: IDoc, next: (err: CallbackError) => void) => {
    // Filtering duplicate keys errors for example:
    if (isMongoError(err) && err.code === MongoError.DuplicateKey.code) {
        next(null);
        return;
    }

    console.error(err);
    next(err);
});
```
