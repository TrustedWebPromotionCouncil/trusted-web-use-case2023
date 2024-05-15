package external

import (
	"io"
)

type SendmailService interface {
	Send(SendmailServiceSendInput) error
}

type SendmailServiceSendInput struct {
	Subject     string
	TextBody    string
	HtmlBody    string
	ToAddresses []string
}

type StorageService interface {
	UploadOpject(StorageServiceUploadInput) (StorageServiceUploadOutput, error)
	GetObjectUrl(StorageServiceGetUrlInput) (StorageServiceGetUrlOutput, error)
}

type StorageObjectClass string

const (
	StorageObjectClassUserAvatar = StorageObjectClass("user_avatar")
)

type StorageObjectAccessScope string

const (
	StorageObjectAccessScopePublic  = StorageObjectAccessScope("public")
	StorageObjectAccessScopePrivate = StorageObjectAccessScope("private")
)

var objectClassAccessScopeMap = map[StorageObjectClass]StorageObjectAccessScope{
	StorageObjectClassUserAvatar: StorageObjectAccessScopePublic,
}

type StorageServiceUploadInput struct {
	ObjectClass StorageObjectClass
	Body        io.Reader
}

type StorageServiceUploadOutput struct {
	Key string
}

type StorageServiceGetUrlInput struct {
	Key string
}

type StorageServiceGetUrlOutput struct {
	Url string
}
