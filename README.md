#### Environment Variables
**NOTE:** 
Make `COOKIE_MAX_AGE` and `REFRESH_TOKEN_EXPIRATION` the same to save 1 round-trip to the server.
```dotenv
# Required
DATABASE_URL= # <connection string>
ACCESS_TOKEN_SECRET_KEY= # <secret>
REFRESH_TOKEN_SECRET_KEY= # <secret>
COOKIE_SECRET_KEY= # <secret>

# Optional
DATABASE_DEBUG= # true | false. Default: false
ACCESS_TOKEN_EXPIRATION= # JWT expiration. Default: 10m
REFRESH_TOKEN_EXPIRATION= # JWT expiration. Default: 30m
COOKIE_MAX_AGE= # amount in seconds. Default: 1800 
``` 
