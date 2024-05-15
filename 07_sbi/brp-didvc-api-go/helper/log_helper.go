package helper

import (
	"log"
	"os"
)

var infoLogger = log.New(os.Stdout, "[INFO] ", log.Ldate|log.Ltime)
var errorLogger = log.New(os.Stdout, "[ERROR] ", log.Ldate|log.Ltime|log.Lshortfile)

func GetInfoLogger() *log.Logger {
	return infoLogger
}

func GetErrorLogger() *log.Logger {
	return errorLogger
}
