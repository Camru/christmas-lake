package main

import "net/http"

func (app *application) enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		// Add the "Vary: Access-Control-Request-Method" header.
		// w.Header().Add("Vary", "Access-Control-Request-Method")
		// w.Header().Set("Access-Control-Allow-Methods", "OPTIONS, PUT, PATCH, DELETE")
		// w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		// w.WriteHeader(http.StatusOK)

		next.ServeHTTP(w, r)
	})
}
