package main

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/camru/greenlight/internal/data"
	"github.com/camru/greenlight/internal/validator"
)

// ID          int64  `json:"id"`
// Title       string `json:"title"`
// DateWatched string `json:"dateWatched"`
// Year        string `json:"year,omitempty"`
// MediaType   string `json:"mediaType"`
// Thumbnail   string `json:"thumbnail"`
// ImdbID      string `json:"imdbID"`
// Rating      string `json:"rating"`
// Version     int32  `json:"version"`

// POST
func (app *application) createMovieHandler(w http.ResponseWriter, r *http.Request) {
	// Declare an anonymous struct to hold the information that we expect to be
	// in the
	// HTTP request body (note that the field names and types in the struct are
	// a subset of the Movie struct that we created earlier). This struct will
	// be our *target decode destination*.
	var input struct {
		Title       string `json:"title"`
		DateWatched string `json:"dateWatched"`
		Year        string `json:"year,omitempty"`
		MediaType   string `json:"mediaType"`
		Thumbnail   string `json:"thumbnail"`
		ImdbID      string `json:"imdbID"`
		Rating      string `json:"rating"`
		Watched     bool   `json:"watched"`
	}

	// Initialize a new json.Decoder instance which reads from the request body,
	// and then use the Decode() method to decode the body contents into the
	// input struct. Importantly, notice that when we call Decode() we pass a
	// *pointer* to the input struct as the target decode destination. If there
	// was an error during decoding, we also use our generic errorResponse()
	// helper to send the client a 400 Bad Request response containing the error
	// message.
	err := app.readJSON(w, r, &input)
	if err != nil {
		app.badRequestResponse(w, r, err)
		return
	}

	// Copy the values from the input struct to a new Movie struct.
	movie := &data.Movie{
		Title:       input.Title,
		DateWatched: input.DateWatched,
		Year:        input.Year,
		MediaType:   input.MediaType,
		Thumbnail:   input.Thumbnail,
		ImdbID:      input.ImdbID,
		Rating:      input.Rating,
		Watched:     input.Watched,
	}

	// Initialize a new Validator instance.
	v := validator.New()

	data.ValidateMovie(v, movie)

	if !v.Valid() {
		app.FailedValidationResponse(w, r, v.Errors)
		return
	}

	// Call the Insert() method on our movies model, passing in a pointer to the
	// validated movie struct. This will create a record in the database and
	// update the movie struct with the system-generated information.
	err = app.models.Movies.Insert(movie)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	// When sending a HTTP response, we want to include a Location header to let
	// the client know which URL they can find the newly-created resource at. We
	// make an empty http.Header map and then use the Set() method to add a new
	// Location header, interpolating the system-generated ID for our new movie
	// in the URL.
	headers := make(http.Header)
	headers.Set("Location", fmt.Sprintf("/v1/movies/%d", movie.ID))

	// Write a JSON response with a 201 Created status code, the movie data in
	// the response body, and the Location header.
	err = app.writeJSON(w, http.StatusCreated, envelope{"media": movie}, headers)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}

// GET
func (app *application) showMovieHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIdParam(r)
	if err != nil || id < 1 {
		app.notFoundResponse(w, r)
		return
	}

	// Call the Get() method to fetch the data for a specific movie. We also
	// need to use the errors.Is() function to check if it returns a
	// data.ErrRecordNotFound error, in which case we send a 404 Not Found
	// response to the client.
	movie, err := app.models.Movies.Get(id)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	data := envelope{
		"movie": movie,
	}

	err = app.writeJSON(w, http.StatusOK, data, nil)
	if err != nil {
		app.logger.Print(err)
		app.serverErrorResponse(w, r, err)
	}
}

// PUT
// func (app *application) updateMovieHandler(w http.ResponseWriter, r *http.Request) {
// 	// Extract the movie ID from the URL.
// 	id, err := app.readIdParam(r)
// 	if err != nil {
// 		app.notFoundResponse(w, r)
// 		return
// 	}

// 	// Fetch the existing movie record from the database, sending a 404 Not
// 	// Found response to the client if we couldn't find a matching record.
// 	movie, err := app.models.Movies.Get(id)
// 	if err != nil {
// 		switch {
// 		case errors.Is(err, data.ErrRecordNotFound):
// 			app.notFoundResponse(w, r)
// 		default:
// 			app.serverErrorResponse(w, r, err)
// 		}
// 		return
// 	}

// 	// Declare an input struct to hold the expected data from the client.
// 	var input struct {
// 		Title *string `json:"title"`
// 		Year  *string `json:"year"`
// 	}

// 	// Read the JSON request body data into the input struct.
// 	err = app.readJSON(w, r, &input)
// 	if err != nil {
// 		app.badRequestResponse(w, r, err)
// 		return
// 	}

// 	// If the input.Title value is nil then we know that no corresponding
// 	// "title" key/ value pair was provided in the JSON request body. So we move
// 	// on and leave the movie record unchanged. Otherwise, we update the movie
// 	// record with the new title value. Importantly, because input.Title is a
// 	// now a pointer to a string, we need to dereference the pointer using the *
// 	// operator to get the underlying value
// 	if input.Title != nil {
// 		movie.Title = *input.Title
// 	}
// 	if input.Year != nil {
// 		movie.Year = *input.Year
// 	}

// 	// if input.Runtime != nil {
// 	// 	movie.Runtime = *input.Runtime
// 	// }

// 	// if input.Genres != nil {
// 	// 	movie.Genres = input.Genres // no need to dereference a slice
// 	// }

// 	// Validate the updated movie record, sending the client a 422 Unprocessable
// 	// Entity response if any checks fail.
// 	v := validator.New()

// 	if data.ValidateMovie(v, movie); !v.Valid() {
// 		app.FailedValidationResponse(w, r, v.Errors)
// 		return
// 	}

// 	err = app.models.Movies.Update(movie)
// 	if err != nil {
// 		switch {
// 		case errors.Is(err, data.ErrEditConflict):
// 			app.editConflictResponse(w, r)

// 		default:
// 			app.serverErrorResponse(w, r, err)
// 		}
// 	}

// 	// Write the updated movie record in a JSON response.
// 	app.writeJSON(w, http.StatusOK, envelope{"movie": movie}, nil)
// 	if err != nil {
// 		app.serverErrorResponse(w, r, err)
// 	}
// }

func (app *application) deleteMovieHandler(w http.ResponseWriter, r *http.Request) {
	id, err := app.readIdParam(r)
	if err != nil {
		app.notFoundResponse(w, r)
		return
	}

	err = app.models.Movies.Delete(id)
	if err != nil {
		switch {
		case errors.Is(err, data.ErrRecordNotFound):
			app.notFoundResponse(w, r)
		default:
			app.serverErrorResponse(w, r, err)
		}
		return
	}

	err = app.writeJSON(w, http.StatusOK, envelope{"message": fmt.Sprintf("Movie with id %v successfully deleted", id)}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}

}
func (app *application) listMoviesHandler(w http.ResponseWriter, r *http.Request) {
	// To keep things consistent with our other handlers, we'll define an input
	// struct to hold the expected values from the request query string.
	var input struct {
		Watched string
		data.Filters
	}

	v := validator.New()

	// Call r.URL.Query() to get the url.Values map containing the query string
	// data from the request.
	qs := r.URL.Query()

	// Use our helpers to extract the title and genres query string values,
	// falling back to defaults of an empty string and an empty slice
	// respectively if they are not provided by the client.
	input.Watched = app.readString(qs, "watched", "")

	// Get the page and page_size query string values as integers. Notice that
	// we set the default page value to 1 and default page_size to 20, and that
	// we pass the validator instance as the final argument here.
	input.Filters.Page = app.readInt(qs, "page", 1, v)
	input.Filters.PageSize = app.readInt(qs, "page_size", 20, v)

	input.Filters.Sort = app.readString(qs, "sort", "id")

	if !v.Valid() {
		app.FailedValidationResponse(w, r, v.Errors)
		return
	}

	movies, err := app.models.Movies.GetAll(input.Watched, input.Filters)
	if err != nil {
		app.serverErrorResponse(w, r, err)
		return
	}

	// Send a JSON response containing the movie data.
	err = app.writeJSON(w, http.StatusOK, envelope{"media": movies}, nil)
	if err != nil {
		app.serverErrorResponse(w, r, err)
	}
}
