package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"strings"

	"github.com/camru/greenlight/internal/validator"
	"github.com/julienschmidt/httprouter"
)

type envelope map[string]any

func (app *application) readIdParam(r *http.Request) (int64, error) {
	// When httprouter is parsing a request, any interpolated URL parameters
	// will be stored in the request context. We can use the ParamsFromContext()
	// function to retrieve a slice containing these parameter names and values.
	params := httprouter.ParamsFromContext(r.Context())

	// We can then use the ByName() method to get the value of the "id"
	// parameter from the slice. In our project all movies will have a unique
	// positive integer ID, but the value returned by ByName() is always a
	// string. So we try to convert it to a base 10 integer (with a bit size of
	// 64). If the parameter couldn't be converted, or is less than 1, we know
	// the ID is invalid so we use the http.NotFound() function to return a 404
	// Not Found response.

	id, err := strconv.ParseInt(params.ByName("id"), 10, 64)
	if err != nil || id < 1 {
		return 0, errors.New("invalid id parameter")
	}

	return id, nil
}

// This is for when a client sends a GET requests and we want to send back a
// JSON response. This takes the destination http.ResponseWriter, the HTTP
// status code to send, the data to encode to JSON, and a header map containing
// any additional HTTP headers we want to include in the response.
func (app *application) writeJSON(w http.ResponseWriter, status int, data envelope, headers http.Header) error {
	js, err := json.MarshalIndent(data, "", "\t")
	if err != nil {
		return err
	}

	// Append a newline to make it easier to view in terminal applications.
	js = append(js, '\n')

	for key, value := range headers {
		w.Header()[key] = value
	}

	// At this point, we know that we won't encounter any more errors before
	// writing the response, so it's safe to add any headers that we want to
	// include. We loop through the header map and add each header to the
	// http.ResponseWriter header map. Note that it's OK if the provided header
	// map is nil. Go doesn't throw an error if you try to range over (or
	// generally, read from) a nil map.
	w.Header().Set("Content-Type", "application/json")
	w.Write(js)

	return nil
}

// This is for when POST requests are sent from the client
func (app *application) readJSON(w http.ResponseWriter, r *http.Request, dst any) error {
	// Use http.MaxBytesReader() to limit the size of the request body to 1MB
	maxBytes := 1048576
	r.Body = http.MaxBytesReader(w, r.Body, int64(maxBytes))

	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()

	// Decode the request body into the target destination
	err := dec.Decode(dst)
	if err != nil {
		// If there is an error during decoding, start the triage
		var syntaxError *json.SyntaxError
		var unmarshalTypeError *json.UnmarshalTypeError
		var invalidUnmarshalError *json.InvalidUnmarshalError

		switch {
		// Use the errors.As() function to check whether the error has the type
		// *json.SyntaxError. If it does, then return a plain-english error message
		// which includes the location of the problem.
		case errors.As(err, &syntaxError):
			return fmt.Errorf("body contains badly-formed JSON (at character %d)", syntaxError.Offset)

		// In some circumstances Decode() may also return an io.ErrUnexpectedEOF
		// error for syntax errors in the JSON. So we check for this using
		// errors.Is() and return a generic error message. There is an open
		// issue regarding this at https://github.com/golang/go/issues/25956.
		case errors.Is(err, io.ErrUnexpectedEOF):
			return errors.New("body contains badly-formed JSON")

		// Likewise, catch any *json.UnmarshalTypeError errors. These occur when
		// the JSON value is the wrong type for the target destination. If the
		// error relates to a specific field, then we include that in our error
		// message to make it easier for the client to debug.
		case errors.As(err, &unmarshalTypeError):
			if unmarshalTypeError.Field != "" {
				return fmt.Errorf("body contains incorrect JSON type for field %q", unmarshalTypeError.Field)
			}
			return fmt.Errorf("body contains incorrect JSON type (at character %d)", unmarshalTypeError.Offset)

		// An io.EOF error will be returned by Decode() if the request body is
		// empty. We check for this with errors.Is() and return a plain-english
		// error message instead.
		case errors.Is(err, io.EOF):
			return errors.New("body must not be empty")

		// A json.InvalidUnmarshalError error will be returned if we pass
		// something that is not a non-nil pointer to Decode(). We catch this
		// and panic, rather than returning an error to our handler. At the end
		// of this chapter we'll talk about panicking versus returning errors,
		// and discuss why it's an appropriate thing to do in this specific
		// situation.
		case errors.As(err, &invalidUnmarshalError):
			panic(err)

		// For anything else, return the error message as-is
		default:
			return err
		}
	}
	return nil
}

// The readString() helper returns a string value from the query string, or the
// provided default value if no matching key could be found.
func (app *application) readString(qs url.Values, key string, defaultValue string) string {
	// Extract the value for a given key from the query string. If no key exists
	// this will return the empty string "".

	value := qs.Get(key)

	// If no key exists (or the value is empty) then return the default value.
	if value == "" {
		return defaultValue
	}

	// Otherwise return the string.
	return value
}

// The readCSV() helper reads a string value from the query string and then
// splits it into a slice on the comma character. If no matching key could be
// found, it returns the provided default value.
func (app *application) readCSV(qs url.Values, key string, defaultValue []string) []string {

	csv := qs.Get(key)

	if csv == "" {
		return defaultValue
	}

	return strings.Split(csv, ",")
}

// The readInt() helper reads a string value from the query string and converts
// it to an integer before returning. If no matching key could be found it
// returns the provided default value. If the value couldn't be converted to an
// integer, then we record an error message in the provided Validator instance.
func (app *application) readInt(qs url.Values, key string, defaultValue int, v *validator.Validator) int {

	str := qs.Get(key)

	if str == "" {
		return defaultValue
	}

	// Try to convert the value to an int. If this fails, add an error message
	// to the validator instance and return the default value.
	i, err := strconv.Atoi(str)
	if err != nil {
		v.AddError(key, "must be an integer value")
		return defaultValue
	}

	return i
}
