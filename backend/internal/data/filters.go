package data

import "strings"

type Filters struct {
	Page         int
	PageSize     int
	Sort         string
	SortSafelist []string
}

// Check that the client-provided Sort field matches one of the entries in our
// safelist and if it does, extract the column name from the Sort field by
// stripping the leading hyphen character (if one exists).
func (f Filters) sortColumn() string {
	for _, safeValue := range f.SortSafelist {
		if f.Sort == safeValue {
			return strings.TrimPrefix(f.Sort, "-")
		}
	}

	panic("unsafe sort parameter: " + f.Sort)
}

// Return the sort direction ("ASC" or "DESC") depending on the prefix character
// of the Sort field.
func (f Filters) sortDirection() string {
	if strings.HasPrefix(f.Sort, "-") {
		return "DESC"
	}

	return "ASC"
}
