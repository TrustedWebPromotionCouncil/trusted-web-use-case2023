package helper

import (
	"context"
	"crypto/ed25519"
	"crypto/rand"
	"errors"
	"os"
	"regexp"

	"github.com/multiformats/go-multibase"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/secretsmanager"
)

const AWS_DEFAULT_REGION = "ap-northeast-1"
const AWS_SECRET_DEFAULT_KEY_NAME = "AuthOrgKeyName"
const AWS_SECRET_PUBLIC_KEY_NAME_POSTFIX = "Public"
const AWS_SECRET_PRIVATE_KEY_NAME_POSTFIX = "Private"
const AWS_SECRET_KEY_NAME_PATTERN = "^[a-z][a-zA-Z0-9-_]*$"
const AWS_SECRET_ERROR_DUPLICATION = "Key already existed on AWS secrets manager."

var AWSCfg aws.Config

func InitAWSCfg() {
	awsRegion := os.Getenv("AWSRegion")
	if awsRegion == "" {
		awsRegion = AWS_DEFAULT_REGION
	}
	GetInfoLogger().Println("awsRegion: " + awsRegion)

	var awsErr error
	AWSCfg, awsErr = config.LoadDefaultConfig(context.Background(),
		config.WithRegion(awsRegion))
	if awsErr != nil {
		panic(awsErr)
	}

	//init Key Pair for AuthOrg
	keyName4AuthOrg := GetKeyName4AuthOrg()
	vcPublicKeyName := GetPublicKeyName(keyName4AuthOrg)

	valueSavedInAws, errGetSecret := GetSecret(AWSCfg, vcPublicKeyName)
	if errGetSecret != nil || valueSavedInAws == "" {
		_, error := GenerateKeyPair(keyName4AuthOrg)
		if error != nil {
			panic(error)
		}
	}
}

func GetKeyName4AuthOrg() string {
	keyName4AuthOrg := os.Getenv(AWS_SECRET_DEFAULT_KEY_NAME)
	if keyName4AuthOrg == "" {
		keyName4AuthOrg = AWS_SECRET_DEFAULT_KEY_NAME
	}
	return keyName4AuthOrg
}

func GetPublicKeyName(keyName string) string {
	return keyName + AWS_SECRET_PUBLIC_KEY_NAME_POSTFIX
}

func GetPrivateKeyName(keyName string) string {
	return keyName + AWS_SECRET_PRIVATE_KEY_NAME_POSTFIX
}

func IsValidKeyName(input string) bool {
	// Create a regex object
	regex := regexp.MustCompile(AWS_SECRET_KEY_NAME_PATTERN)

	// Match the input string against the regex pattern
	match := regex.MatchString(input)

	return match
}

func GenerateKeyPair(keyName string) (string, error) {
	GetInfoLogger().Println("GenerateKeyPair function. keyName: " + keyName)

	vcPublicKey, vcPrivateKey, _ := ed25519.GenerateKey(rand.Reader)

	vcPublicKeyMultiBase, error := multibase.Encode(multibase.Base58BTC, vcPublicKey)
	if error != nil {
		return "", error
	}

	errorSavePublicKey := savePublicKey(AWSCfg, vcPublicKeyMultiBase, keyName)
	if errorSavePublicKey != nil {
		return "", errorSavePublicKey
	}

	vcPrivateKeyMultiBase, error := multibase.Encode(multibase.Base58BTC, vcPrivateKey)
	if error != nil {
		return "", error
	}

	errorSavePrivateKey := savePrivateKey(AWSCfg, vcPrivateKeyMultiBase, keyName)
	if errorSavePrivateKey != nil {
		return "", errorSavePrivateKey
	}

	return vcPublicKeyMultiBase, nil
}

func savePublicKey(cfg aws.Config, value string, keyName string) error {
	GetInfoLogger().Println("savePublicKey function.")

	vcPublicKeyName := GetPublicKeyName(keyName)

	valueSavedInAws, errGetSecret := GetSecret(cfg, vcPublicKeyName)
	if errGetSecret == nil && valueSavedInAws != "" {
		return errors.New(AWS_SECRET_ERROR_DUPLICATION)
	}

	awsArn, errCreateSecret := createSecret(cfg, vcPublicKeyName, value)
	if errCreateSecret != nil {
		return errCreateSecret
	} else {
		GetInfoLogger().Println("Public Key was save at aws ARN: " + awsArn)
	}

	return nil
}

func savePrivateKey(cfg aws.Config, value string, keyName string) error {
	GetInfoLogger().Println("savePrivateKey function.")

	vcPrivateKeyName := GetPrivateKeyName(keyName)

	valueSavedInAws, errGetSecret := GetSecret(cfg, vcPrivateKeyName)
	if errGetSecret == nil && valueSavedInAws != "" {
		return errors.New(AWS_SECRET_ERROR_DUPLICATION)
	}

	awsArn, errCreateSecret := createSecret(cfg, vcPrivateKeyName, value)
	if errCreateSecret != nil {
		return errCreateSecret
	} else {
		GetInfoLogger().Println("Private Key was save at aws ARN: " + awsArn)
	}

	return nil
}

// This creates a secret and returns out its ARN
// snippet-start:[secretsmanager.go-v2.CreateSecret]
func createSecret(cfg aws.Config, name string, value string) (string, error) {

	conn := secretsmanager.NewFromConfig(cfg)

	result, err := conn.CreateSecret(context.TODO(), &secretsmanager.CreateSecretInput{
		Name: aws.String(name),
		// descriptions are optional
		Description: aws.String(name),
		// You must provide either SecretString or SecretBytes.
		// Both is considered invalid.
		SecretString: aws.String(value),
	})

	if err != nil {
		return "", err
	}

	return *result.ARN, err

}

// snippet-start:[secretsmanager.go-v2.GetSecret]
// Retrieve the plaintext of a secret given its identifier (ARN or name)
func GetSecret(config aws.Config, secretId string) (string, error) {
	conn := secretsmanager.NewFromConfig(config)

	result, err := conn.GetSecretValue(context.TODO(), &secretsmanager.GetSecretValueInput{
		SecretId: aws.String(secretId),
	})

	if err != nil {
		return "", err
	}

	return *result.SecretString, err
}
