package data

import (
	"context"
	"database/sql"
	"errors"
	"time"

	"github.com/camru/greenlight/internal/validator"
)

// Annotate the Movie struct with struct tags to control how the keys appear in
// the JSON-encoded output.

type Movie struct {
	ID          int64  `json:"id"`
	Title       string `json:"title"`
	DateWatched string `json:"dateWatched"`
	Year        string `json:"year,omitempty"`
	MediaType   string `json:"mediaType"`
	Thumbnail   string `json:"thumbnail"`
	ImdbID      string `json:"imdbID"`
	Rating      string `json:"rating"`
	Watched     bool   `json:"watched"`
	Version     int32  `json:"version"`
}

func ValidateMovie(v *validator.Validator, movie *Movie) {
	v.Check(movie.Title != "", "title", "must be provided")
	v.Check(len(movie.Title) <= 500, "title", "must not be more than 500 bytes long")

	// v.Check(movie.Year != 0, "year", "must be provided")
	// v.Check(movie.Year >= 1888, "year", "must be greater than 1888")
	// v.Check(movie.Year <= int32(time.Now().Year()), "year", "must not be in the future")

	// v.Check(movie.Runtime != 0, "runtime", "must be provided")
	// v.Check(movie.Runtime > 0, "runtime", "must be a positive integer")

	// v.Check(movie.Genres != nil, "genres", "must be provided")
	// v.Check(len(movie.Genres) >= 1, "genres", "must contain at least 1 genre")
	// v.Check(len(movie.Genres) <= 5, "genres", "must not contain more than 5 genres")
	// v.Check(validator.Unique(movie.Genres), "genres", "must not contain duplicate values")
}

// Define a MovieModel struct type which wraps a sql.DB connection pool.
type MovieModel struct {
	DB *sql.DB
}

// Add a placeholder method for inserting a new record in the movies table.
func (m MovieModel) Insert(movie *Movie) error {
	// Define the SQL query for inserting a new record in the movies table and
	// returning the system-generated data.
	query := `
	INSERT INTO media (title, dateWatched, year, mediaType, thumbnail, imdbID, rating, watched)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
	RETURNING id, version, imdbID`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	// Create an args slice containing the values for the placeholder parameters
	// from the movie struct. Declaring this slice immediately next to our SQL
	// query helps to make it nice and clear *what values are being used where*
	// in the query.
	args := []any{movie.Title, movie.DateWatched, movie.Year, movie.MediaType, movie.Thumbnail, movie.ImdbID, movie.Rating, movie.Watched}

	// Use the QueryRow() method to execute the SQL query on our connection
	// pool, passing in the args slice as a variadic parameter and scanning the
	// system- generated id, created_at and version values into the movie
	// struct.
	m.DB.QueryRowContext(ctx, query, args...).Scan(&movie.ID, &movie.Version, &movie.ImdbID)

	return nil
}

// ID          int64  `json:"id"`
// Title       string `json:"title"`
// DateWatched string `json:"dateWatched"`
// Year        string `json:"year,omitempty"`
// MediaType   string `json:"mediaType"`
// Thumbnail   string `json:"thumbnail"`
// ImdbID      string `json:"imdbID"`
// Rating      string `json:"rating"`
// Version     int32  `json:"version"`

func (m MovieModel) Get(id int64) (*Movie, error) {
	// The PostgreSQL bigserial type that we're using for the movie ID starts
	// auto-incrementing at 1 by default, so we know that no movies will have ID
	// values less than that. To avoid making an unnecessary database call, we
	// take a shortcut and return an ErrRecordNotFound error straight away.
	if id < 1 {
		return nil, ErrRecordNotFound
	}

	// Define the SQL query for retrieving the movie data.
	query := `SELECT id, title, dateWatched, year, mediaType, thumbnail, imdbID, rating, watched, version
	FROM media 
	WHERE id = $1`

	// Declare a Movie struct to hold the data returned by the query.
	var movie Movie

	// Use the context.WithTimeout() function to create a context.Context which
	// carries a 3-second timeout deadline. Note that we're using the empty
	// context.Background() as the 'parent' context.
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	// Execute the query using the QueryRow() method, passing in the provided id
	// value as a placeholder parameter, and scan the response data into the fields
	// of the Movie struct. Importantly, notice that we need to convert the scan
	// target for the genres column using the pq.Array() adapter function again.
	err := m.DB.QueryRowContext(ctx, query, id).Scan(
		&movie.ID,
		&movie.Title,
		&movie.DateWatched,
		&movie.Year,
		&movie.MediaType,
		&movie.Thumbnail,
		&movie.ImdbID,
		&movie.Rating,
		&movie.Watched,
		&movie.Version,
	)

	// Handle any errors. If there was no matching movie found, Scan() will
	// return a sql.ErrNoRows error. We check for this and return our custom
	// ErrRecordNotFound error instead.
	if err != nil {
		switch {
		case errors.Is(err, sql.ErrNoRows):
			return nil, ErrRecordNotFound
		default:
			return nil, err
		}
	}

	return &movie, nil
}

// func (m MovieModel) Update(movie *Movie) error {
// 	// Declare the SQL query for updating the record and returning the new
// 	// version number.
// 	query := `
// 	UPDATE media
// 	SET title = $1, year = $2, runtime = $3, genres = $4, version = version + 1
// 	WHERE id = $5 AND version = $6
// 	RETURNING version`

// 	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
// 	defer cancel()

// 	// Create an args slice containing the values for the placeholder
// 	// parameters.
// 	args := []any{
// 		movie.Title,
// 		movie.Year,
// 		movie.Runtime,
// 		pq.Array(movie.Genres),
// 		movie.ID,
// 		movie.Version,
// 	}

// 	// Execute the SQL query. If no matching row could be found, we know the
// 	// movie version has changed (or the record has been deleted) and we return
// 	// our custom ErrEditConflict error.
// 	err := m.DB.QueryRowContext(ctx, query, args...).Scan(&movie.Version)
// 	if err != nil {
// 		switch {
// 		case errors.Is(err, sql.ErrNoRows):
// 			return ErrEditConflict

// 		default:
// 			return err
// 		}
// 	}

// 	return nil
// }

func (m MovieModel) Delete(id int64) error {
	if id < 1 {
		return ErrRecordNotFound
	}

	query := `DELETE FROM media 
	WHERE id = $1`

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	res, err := m.DB.ExecContext(ctx, query, id)
	if err != nil {
		return err
	}

	rowsAffected, err := res.RowsAffected()
	if err != nil {
		return err
	}

	// If no rows were affected, we know that the movies table didn't contain a
	// record with the provided ID at the moment we tried to delete it. In that
	// case we return an ErrRecordNotFound error.
	if rowsAffected == 0 {
		return ErrRecordNotFound
	}

	return nil
}

// Create a new GetAll() method which returns a slice of movies. Although we're not
// using them right now, we've set this up to accept the various filter parameters as
// arguments.
func (m MovieModel) GetAll(watched string, filters Filters) ([]*Movie, error) {
	// Construct the SQL query to retrieve all movie records.
	query := `
		SELECT id, title, dateWatched, year, mediaType, thumbnail, imdbID, rating, watched, version
        FROM media 
		WHERE watched = (
			CASE 
				WHEN $1 = 'true' THEN true 
				WHEN $1 = 'false' THEN false 
				ELSE false
			END
		) OR $1 = ''
        ORDER BY id`

	// Create a context with a 3-second timeout.
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	// Use QueryContext() to execute the query. This returns a sql.Rows resultset
	// containing the result.
	rows, err := m.DB.QueryContext(ctx, query, watched)
	if err != nil {
		return nil, err
	}

	// Importantly, defer a call to rows.Close() to ensure that the resultset is closed
	// before GetAll() returns.
	defer rows.Close()

	// Initialize an empty slice to hold the movie data.
	movies := []*Movie{}

	// Use rows.Next to iterate through the rows in the resultset.
	for rows.Next() {
		// Initialize an empty Movie struct to hold the data for an individual movie.
		var movie Movie

		// Scan the values from the row into the Movie struct. Again, note that we're
		// using the pq.Array() adapter on the genres field here.
		err := rows.Scan(
			&movie.ID,
			&movie.Title,
			&movie.DateWatched,
			&movie.Year,
			&movie.MediaType,
			&movie.Thumbnail,
			&movie.ImdbID,
			&movie.Rating,
			&movie.Watched,
			&movie.Version,
		)
		if err != nil {
			return nil, err
		}

		// Add the Movie struct to the slice.
		movies = append(movies, &movie)
	}

	// When the rows.Next() loop has finished, call rows.Err() to retrieve any error
	// that was encountered during the iteration.
	if err = rows.Err(); err != nil {
		return nil, err
	}

	// If everything went OK, then return the slice of movies.
	return movies, nil
}
