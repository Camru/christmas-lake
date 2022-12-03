## Migrations

// Create
migrate create -seq -ext=.sql -dir=./migrations add_movies_check_constraints

// Up/Down
migrate -path=./migrations -database=$GREENLIGHT_DB_DSN up

link: file:///Users/crudisill/Sync/Code/go/lets-go-further/html/06.02-working-with-sql-migrations.html

## Create a Movie

    ID          int64  `json:"id"`
    Title       string `json:"title"`
    DateWatched string `json:"dateWatched"`
    Year        string `json:"year,omitempty"`
    MediaType   string `json:"mediaType"`
    Thumbnail   string `json:"thumbnail"`
    ImdbID      string `json:"imdbID"`
    Rating      string `json:"rating"`
    Watched     bool   `json:"watched",
    Version     int32  `json:"version"`

BODY='{"title":"Testing", "dateWatched": "11/22/22", "year":"2008-2012", "MediaType":"movie","Thumbnail":"some.jpg", "ImdbId": "1209831", "Rating": "8.0/10.0", "Watched": true}'
curl -d "$BODY" localhost:4000/v1/movies
