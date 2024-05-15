package external

import (
	"encoding/json"
	"fmt"
)

func prettyStruct(v any) string {
	b, err := json.MarshalIndent(v, "", "  ")
	if err != nil {
		fmt.Println("error:", err)
	}
	return string(b)
}
