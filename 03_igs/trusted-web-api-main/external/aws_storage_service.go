package external

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/cloudfront/sign"
	"github.com/aws/aws-sdk-go-v2/feature/s3/manager"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/gabriel-vasile/mimetype"
	"github.com/google/uuid"
)

type awsStorageService struct {
	s3Svc                   *s3.Client
	downloader              *manager.Downloader
	uploader                *manager.Uploader
	bucket                  string
	signer                  *sign.URLSigner
	storageMainUrl          string
	signedUrlExpireDuration time.Duration
	publicBasePath          string
}

type awsStorageServiceDependencies struct {
	Profile                     string
	Region                      string
	Bucket                      string
	CloudfrontSignKeyId         string
	CloudfrontSignPrivateKeyPem string
	StorageMainUrl              string
	SignedUrlExpireDuration     time.Duration
	PublicBasePath              string
}

func newAwsStorageService(d awsStorageServiceDependencies) (*awsStorageService, error) {
	var (
		cfg aws.Config
		err error
	)

	if d.Profile == "" {
		cfg, err = config.LoadDefaultConfig(context.TODO(), config.WithRegion(d.Region))
	} else {
		cfg, err = config.LoadDefaultConfig(context.TODO(), config.WithRegion(d.Region), config.WithSharedConfigProfile(d.Profile))
	}
	if err != nil {
		logger.Errorf("unable to load SDK config, %v", err)
		return nil, err
	}
	s3Client := s3.NewFromConfig(cfg)

	privKey, err := sign.LoadPEMPrivKey(strings.NewReader(d.CloudfrontSignPrivateKeyPem))
	if err != nil {
		logger.Error(err)
		return nil, err
	}

	return &awsStorageService{
		s3Svc:                   s3Client,
		downloader:              manager.NewDownloader(s3Client),
		uploader:                manager.NewUploader(s3Client),
		bucket:                  d.Bucket,
		signer:                  sign.NewURLSigner(d.CloudfrontSignKeyId, privKey),
		storageMainUrl:          d.StorageMainUrl,
		signedUrlExpireDuration: d.SignedUrlExpireDuration,
		publicBasePath:          d.PublicBasePath,
	}, nil
}

func (s *awsStorageService) UploadOpject(i StorageServiceUploadInput) (StorageServiceUploadOutput, error) {
	mime, err := mimetype.DetectReader(i.Body)
	if err != nil {
		return StorageServiceUploadOutput{}, err
	}

	key := s.objectKey(objectClassAccessScopeMap[i.ObjectClass], i.ObjectClass, mime.Extension())
	_, err = s.uploader.Upload(context.TODO(), &s3.PutObjectInput{
		Bucket:      aws.String(s.bucket),
		Key:         aws.String(key),
		Body:        i.Body,
		ContentType: aws.String(mime.String()),
	})
	if err != nil {
		return StorageServiceUploadOutput{}, err
	}
	return StorageServiceUploadOutput{
		Key: key,
	}, nil
}

func (s *awsStorageService) GetObjectUrl(i StorageServiceGetUrlInput) (StorageServiceGetUrlOutput, error) {
	logger.Debug(i.Key)
	// publicフォルダ配下のオブジェクトは署名なしURLでアクセス可能
	if strings.HasPrefix(i.Key, s.publicBasePath) {
		return StorageServiceGetUrlOutput{
			Url: fmt.Sprintf("%s/%s", s.storageMainUrl, i.Key),
		}, nil
	}

	// それ以外のオブジェクトは署名付きURLを生成して返却
	signedURL, err := s.signer.Sign(fmt.Sprintf("%s/%s", s.storageMainUrl, i.Key), time.Now().Add(s.signedUrlExpireDuration))
	if err != nil {
		logger.Error(err)
		return StorageServiceGetUrlOutput{}, err
	}

	return StorageServiceGetUrlOutput{
		Url: signedURL,
	}, nil
}

func (s *awsStorageService) objectKey(accessScope StorageObjectAccessScope, class StorageObjectClass, extension string) string {
	paths := []string{}
	if accessScope == StorageObjectAccessScopePublic {
		paths = append(paths, "public")
	}
	paths = append(paths, string(class))
	paths = append(paths, uuid.New().String())
	return strings.Join(paths, "/")
}
