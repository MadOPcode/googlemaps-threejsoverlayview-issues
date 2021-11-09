# googlemaps-threejsoverlayview-issues

This repo contains some issues I've encountered with `@googlemaps/three` package.

## Deployment

Create a `.env` file in the root directory and populate it with variables
from `.env.example` file and their corresponding values.  
Then run
```
npm run dev
```

After this the following URLs can be accessed:  
http://localhost:8080/fp-precision (correct boxes' location, but boxes jitter)  
http://localhost:8080/rel-coords (wrong location of boxB, but boxes don't jitter)
