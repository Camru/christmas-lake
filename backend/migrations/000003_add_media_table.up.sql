DROP TABLE IF EXISTS movies;

CREATE TABLE IF NOT EXISTS media (
    id bigserial PRIMARY KEY,  
    dateWatched text NOT NULL, 
    title text NOT NULL,
	mediaType text NOT NULL,
	thumbnail text NOT NULL,
	imdbID text NOT NULL,
    year text NOT NULL,
	rating text NOT NULL,
    version integer NOT NULL DEFAULT 1
);