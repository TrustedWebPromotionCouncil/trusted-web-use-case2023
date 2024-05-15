package external

import (
	"context"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/sesv2"
	"github.com/aws/aws-sdk-go-v2/service/sesv2/types"
)

type awsSendmailService struct {
	sesSvc      *sesv2.Client
	fromAddress string
}

type awsSendmailServiceDependencies struct {
	Profile     string
	Region      string
	FromAddress string
}

func newAwsSendmailService(d awsSendmailServiceDependencies) (*awsSendmailService, error) {
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
	}
	sesClient := sesv2.NewFromConfig(cfg)

	return &awsSendmailService{
		sesSvc:      sesClient,
		fromAddress: d.FromAddress,
	}, nil
}

func (s *awsSendmailService) Send(i SendmailServiceSendInput) error {
	charset := aws.String("UTF-8")
	body := &types.Body{}
	if i.TextBody != "" {
		body.Text = &types.Content{
			Charset: charset,
			Data:    aws.String(i.TextBody),
		}
	}
	if i.HtmlBody != "" {
		body.Html = &types.Content{
			Charset: charset,
			Data:    aws.String(i.HtmlBody),
		}
	}

	sendEmailInput := &sesv2.SendEmailInput{
		Content: &types.EmailContent{
			Simple: &types.Message{
				Body: body,
				Subject: &types.Content{
					Charset: charset,
					Data:    aws.String(i.Subject),
				},
			},
		},
		FromEmailAddress: aws.String(s.fromAddress),
		Destination: &types.Destination{
			ToAddresses: i.ToAddresses,
		},
	}
	sendEmailOutput, err := s.sesSvc.SendEmail(context.TODO(), sendEmailInput)
	if err != nil {
		logger.Error(err)
		return err
	}
	logger.Info(sendEmailOutput)

	return nil
}
