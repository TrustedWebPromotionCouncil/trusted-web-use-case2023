package logger

func existsString(arrayData []string, val string) bool {
	for _, v := range arrayData {
		if v == val {
			return true
		}
	}
	return false
}
