package helper

import (
	"encoding/json"
	"fmt"
	"reflect"
)

func ToPrettyJSON(data interface{}) string {
	jsonBytes, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		fmt.Println("Error marshaling to JSON:", err)
		return ""
	}
	return string(jsonBytes)
}

func IsWhitespace(r rune) bool {
	return r == '\n' || r == '\t'
}

func IsEmpty(value interface{}) bool {
	if value == nil {
		return true
	}

	switch reflect.TypeOf(value).Kind() {
	case reflect.String, reflect.Array, reflect.Slice, reflect.Map:
		return reflect.ValueOf(value).Len() == 0
	case reflect.Bool:
		return !reflect.ValueOf(value).Bool()
	case reflect.Int, reflect.Int8, reflect.Int16, reflect.Int32, reflect.Int64:
		return reflect.ValueOf(value).Int() == 0
	case reflect.Uint, reflect.Uint8, reflect.Uint16, reflect.Uint32, reflect.Uint64:
		return reflect.ValueOf(value).Uint() == 0
	case reflect.Float32, reflect.Float64:
		return reflect.ValueOf(value).Float() == 0
	case reflect.Complex64, reflect.Complex128:
		return reflect.ValueOf(value).Complex() == 0
	case reflect.Ptr, reflect.Interface:
		return reflect.ValueOf(value).IsNil()
	}

	return false
}

func ExtractSubJsonString(input string) string {
	var braceCount int

	braceCount = 0
	startIndex := -1
	for i, char := range input {
		if char == '{' {
			braceCount++
			if braceCount == 2 {
				startIndex = i
				break
			}
		}
	}

	braceCount = 0
	endIndex := -1
	// Iterate through the input string in reverse order
	for i := len(input) - 1; i >= 0; i-- {
		char := input[i]
		if char == '}' {
			braceCount++
			if braceCount == 2 {
				endIndex = i
			}
		}
	}

	if startIndex != -1 && endIndex != -1 && endIndex > startIndex {
		return input[startIndex : endIndex+1]
	}

	return "{}"
}
