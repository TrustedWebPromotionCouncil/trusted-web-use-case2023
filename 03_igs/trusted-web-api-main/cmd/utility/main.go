package main

import (
	"crypto/rand"
	"crypto/rsa"
	"encoding/json"
	"io"
	"log"
	"os"

	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain"
	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain/helper/ckks"
	rsa_helper "github.com/Institution-for-a-Global-Society/trusted-web-api/domain/helper/rsa"
	"github.com/tuneinsight/lattigo/v4/rlwe"
	"github.com/urfave/cli/v2"
)

func Init() *cli.App {
	rsa := &cli.Command{
		Name:        "rsa",
		Description: "rsa 関連ユーティリティ",
		Subcommands: []*cli.Command{
			{
				Name:        "generate-key",
				Aliases:     []string{"g"},
				Description: "秘密鍵を生成（pem）",
				UsageText:   "generate-key >secret.key",
				Action: func(c *cli.Context) error {
					enckey, err := rsa_helper.GenerateKeysB64s()
					if err != nil {
						panic(err)
					}
					os.Stdout.Write([]byte(enckey.Privatekey))
					return nil
				},
			},
			{
				Name:        "encrypt",
				Aliases:     []string{"e"},
				Description: "暗号化する",
				UsageText:   "encrypt -k secret.key <plain.txt",
				Flags: []cli.Flag{
					&cli.StringFlag{
						Name:     "privatekey",
						Aliases:  []string{"k"},
						Required: true,
					},
				},
				Action: func(c *cli.Context) error {
					bssk, err := os.ReadFile(c.String("privatekey"))
					if err != nil {
						panic(err)
					}
					sk, err := rsa_helper.PrivateKeyFromPem(bssk)
					if err != nil {
						panic(err)
					}

					bsin, err := io.ReadAll(os.Stdin)
					if err != nil {
						panic(err)
					}
					result, err := rsa.EncryptPKCS1v15(rand.Reader, &sk.PublicKey, bsin)
					if err != nil {
						panic(err)
					}
					os.Stdout.Write(result)
					return nil
				},
			},
			{
				Name:        "decrypt",
				Aliases:     []string{"d"},
				Description: "復号化する",
				UsageText:   "decrypt -k secret.key <encrypted.txt",
				Flags: []cli.Flag{
					&cli.StringFlag{
						Name:     "privatekey",
						Aliases:  []string{"k"},
						Required: true,
					},
				},
				Action: func(c *cli.Context) error {
					bssk, err := os.ReadFile(c.String("privatekey"))
					if err != nil {
						panic(err)
					}
					sk, err := rsa_helper.PrivateKeyFromPem(bssk)
					if err != nil {
						panic(err)
					}

					bsin, err := io.ReadAll(os.Stdin)
					if err != nil {
						panic(err)
					}
					result, err := rsa.DecryptPKCS1v15(rand.Reader, sk, bsin)
					if err != nil {
						panic(err)
					}
					os.Stdout.Write(result)
					return nil
				},
			},
		},
	}

	ckks := &cli.Command{
		Name:        "ckks",
		Description: "ckks 関連ユーティリティ",
		Subcommands: []*cli.Command{
			{
				Name:        "generate-key",
				Aliases:     []string{"g"},
				Description: "秘密鍵を生成（base64化したもの）",
				UsageText:   "generate-key >secret.key",
				Action: func(c *cli.Context) error {
					enckey, err := ckks.GenerateKeysB64s(domain.DefaultRotateRange)
					if err != nil {
						panic(err)
					}
					os.Stdout.Write([]byte(enckey.Secretkey))
					return nil
				},
			},
			{
				Name:        "encrypt",
				Aliases:     []string{"e"},
				Description: "float64 のベクトルを暗号化する",
				UsageText:   "encrypt -k secret.key <float64-array.json",
				Flags: []cli.Flag{
					&cli.StringFlag{
						Name:     "secretkey",
						Aliases:  []string{"k"},
						Required: true,
					},
				},
				Action: func(c *cli.Context) error {
					bssk, err := os.ReadFile(c.String("secretkey"))
					if err != nil {
						panic(err)
					}
					sk, err := ckks.FromBase64String[rlwe.SecretKey](string(bssk))
					if err != nil {
						panic(err)
					}
					dec, err := ckks.NewCalculatorUsingSecretkey(sk)
					if err != nil {
						panic(err)
					}
					enc, err := dec.NewCalculatorUsingPublickey(domain.DefaultRotateRange)
					if err != nil {
						panic(err)
					}

					bsin, err := io.ReadAll(os.Stdin)
					if err != nil {
						panic(err)
					}
					var vin []float64
					err = json.Unmarshal(bsin, &vin)
					if err != nil {
						panic(err)
					}

					ct := enc.Encrypt(vin)
					bsout, err := ckks.ToBase64String(ct)
					if err != nil {
						panic(err)
					}

					os.Stdout.Write([]byte(bsout))
					return nil
				},
			},
			{
				Name:        "decrypt",
				Aliases:     []string{"d"},
				Description: "暗号化ベクトルを復号化する",
				UsageText:   "decrypt -k secret.key <encrypted.txt",
				Flags: []cli.Flag{
					&cli.StringFlag{
						Name:     "secretkey",
						Aliases:  []string{"k"},
						Required: true,
					},
				},
				Action: func(c *cli.Context) error {
					bssk, err := os.ReadFile(c.String("secretkey"))
					if err != nil {
						panic(err)
					}
					sk, err := ckks.FromBase64String[rlwe.SecretKey](string(bssk))
					if err != nil {
						panic(err)
					}
					dec, err := ckks.NewCalculatorUsingSecretkey(sk)
					if err != nil {
						panic(err)
					}

					bsin, err := io.ReadAll(os.Stdin)
					if err != nil {
						panic(err)
					}
					ct, err := ckks.FromBase64String[rlwe.Ciphertext](string(bsin))
					if err != nil {
						panic(err)
					}
					v := dec.Decrypt(ct)

					vout := make([]float64, len(v), cap(v))
					for i := range vout {
						vout[i] = float64(real(v[i]))
					}
					bsout, err := json.Marshal(vout)
					if err != nil {
						panic(err)
					}

					os.Stdout.Write(bsout)
					return nil
				},
			},
		},
	}

	return &cli.App{
		Commands: []*cli.Command{rsa, ckks},
	}
}

func main() {
	app := Init()

	if err := app.Run(os.Args); err != nil {
		log.Fatal(err)
	}
}
