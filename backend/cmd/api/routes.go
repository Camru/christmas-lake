package main

import (
	"net/http"
	"os"
	"path"
	"strings"

	"github.com/julienschmidt/httprouter"
)

var STATIC_DIR = "../frontend/dist"

var fs = http.FileServer(http.Dir(STATIC_DIR))

func redirectToIndex(w http.ResponseWriter, r *http.Request) {
	// If the path is not an api path, and it's not the root path "/", check
	// if there is a file that matches in the static directory. If there isn't
	// return the root path that resolves back to index.html
	if r.URL.Path != "/" {
		fullPath := STATIC_DIR + strings.TrimPrefix(path.Clean(r.URL.Path), "/")
		_, err := os.Stat(fullPath)
		if err != nil {
			if !os.IsNotExist(err) {
				panic(err)
			}
			// Requested file does not exist so we return the default (resolves to index.html)
			r.URL.Path = "/"
		}
	}

	fs.ServeHTTP(w, r)

}

func (app *application) routes() http.Handler {
	router := httprouter.New()

	// Likewise, convert the methodNotAllowedResponse() helper to a
	// http.Handler and set
	// it as the custom error handler for 405 Method Not Allowed responses.
	router.MethodNotAllowed = http.HandlerFunc(app.methodNotAllowedResponse)

	// Register the relevant methods, URL patterns and handler functions for
	// our endpoints using the HandlerFunc() method. Note that
	// http.MethodGet and http.MethodPost are constants which equate to the
	// strings "GET" and "POST" respectively.
	router.HandlerFunc(http.MethodGet, "/v1/healthcheck", app.healthcheckHandler)
	router.HandlerFunc(http.MethodPost, "/v1/movies", app.createMovieHandler)
	router.HandlerFunc(http.MethodGet, "/v1/movies", app.listMoviesHandler)
	router.HandlerFunc(http.MethodGet, "/v1/movies/:id", app.showMovieHandler)
	router.HandlerFunc(http.MethodPut, "/v1/movies/:id", app.updateMovieHandler)
	router.HandlerFunc(http.MethodDelete, "/v1/movies/:id", app.deleteMovieHandler)

	// These map to the frontend routes handled by react-router
	router.HandlerFunc(http.MethodGet, "/to-watch", redirectToIndex)
	router.HandlerFunc(http.MethodGet, "/watched", redirectToIndex)
	router.HandlerFunc(http.MethodGet, "/search", redirectToIndex)

	router.NotFound = fs

	return router
	// return app.enableCORS(router)
}
