package entry

import (
	"encoding/csv"
	"io"
	"log"

	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain"
	"github.com/jszwec/csvutil"
)

type CsvRecord struct {
	domain.CandidateProfile `csv:",inline"`
	domain.CandidateVector  `csv:",inline"`
}

type ReaderResult struct {
	Record CsvRecord
	Err    error
}

func EachLineCsv(reader io.Reader, ch chan ReaderResult) error {
	defer close(ch)

	csvr := csv.NewReader(reader)
	csvr.Comma = ','

	dec, err := csvutil.NewDecoder(csvr)
	if err != nil {
		log.Fatal(err)
	}

	for {
		var u CsvRecord
		err := dec.Decode(&u)
		if err == io.EOF {
			break
		} else if err != nil {
			ch <- ReaderResult{Record: u, Err: err}
			continue
		}
		ch <- ReaderResult{Record: u, Err: nil}
	}

	return nil
}
