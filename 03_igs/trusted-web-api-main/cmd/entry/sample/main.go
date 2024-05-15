package main

import (
	"bufio"
	"encoding/base64"
	"fmt"
	"log"
	"os"

	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain"
	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain/entry"
	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain/helper/ckks"
	rsa_helper "github.com/Institution-for-a-Global-Society/trusted-web-api/domain/helper/rsa"
	"github.com/tuneinsight/lattigo/v4/rlwe"
	"github.com/urfave/cli/v2"
)

func Init() *cli.App {
	profile := &cli.Command{
		Name:    "profile",
		Aliases: []string{"p"},
		Flags: []cli.Flag{
			&cli.StringFlag{
				Name:    "privatekey",
				Aliases: []string{"k"},
			},
		},
		Subcommands: []*cli.Command{
			{
				Name:        "encrypt",
				Aliases:     []string{"e"},
				Description: "暗号化する",
				Action: func(c *cli.Context) error {
					inputfile := c.String("inputfile")
					privatekey := c.String("privatekey")

					bssk, err := os.ReadFile(privatekey)
					if err != nil {
						return err
					}
					sk, err := rsa_helper.PrivateKeyFromPem(bssk)
					if err != nil {
						return err
					}

					fp, err := os.Open(inputfile)
					if err != nil {
						return err
					}
					defer fp.Close()

					ch := make(chan entry.ReaderResult)
					go entry.EachLineCsv(fp, ch)

					for v := range ch {
						if v.Err != nil {
							return v.Err
						}

						bs, err := v.Record.CandidateProfile.EncryptRSA(&sk.PublicKey)
						if err != nil {
							return err
						}
						b64s := base64.StdEncoding.EncodeToString(bs)

						os.Stdout.Write([]byte(b64s))
						os.Stdout.Write([]byte("\n"))
					}

					return nil
				},
			},
			{
				Name:        "decrypt",
				Aliases:     []string{"d"},
				Description: "復号化する",
				Action: func(c *cli.Context) error {
					bssk, err := os.ReadFile(c.String("privatekey"))
					if err != nil {
						return err
					}
					sk, err := rsa_helper.PrivateKeyFromPem(bssk)
					if err != nil {
						return err
					}

					scanner := bufio.NewScanner(os.Stdin)
					for scanner.Scan() {
						b64s := scanner.Text()
						bs, err := base64.StdEncoding.DecodeString(b64s)
						if err != nil {
							return err
						}

						var p domain.CandidateProfile
						p.DecryptRSA(bs, sk)

						fmt.Printf("%#v\n", p)
					}
					if err := scanner.Err(); err != nil {
						return err
					}

					return nil
				},
			},
		},
	}

	vector := &cli.Command{
		Name:    "vector",
		Aliases: []string{"v"},
		Flags: []cli.Flag{
			&cli.StringFlag{
				Name:    "secretkey",
				Aliases: []string{"k"},
			},
		},
		Subcommands: []*cli.Command{
			{
				Name:    "encrypt",
				Aliases: []string{"e"},
				Action: func(c *cli.Context) error {
					inputfile := c.String("inputfile")
					bssk, err := os.ReadFile(c.String("secretkey"))
					if err != nil {
						return err
					}
					sk, err := ckks.FromBase64String[rlwe.SecretKey](string(bssk))
					if err != nil {
						return err
					}
					dec, err := ckks.NewCalculatorUsingSecretkey(sk)
					if err != nil {
						return err
					}
					enc, err := dec.NewCalculatorUsingPublickey(domain.DefaultRotateRange)
					if err != nil {
						return err
					}

					fp, err := os.Open(inputfile)
					if err != nil {
						return err
					}
					defer fp.Close()

					ch := make(chan entry.ReaderResult)
					go entry.EachLineCsv(fp, ch)

					for v := range ch {
						if v.Err != nil {
							return v.Err
						}

						ct := v.Record.CandidateVector.EncryptRLWE(&enc.CalculatorUsingPublickey)
						b64s, err := ckks.ToBase64String(ct)
						if err != nil {
							return err
						}

						os.Stdout.Write([]byte(b64s))
						os.Stdout.Write([]byte("\n"))
					}

					return nil
				},
			},
			{
				Name:    "decrypt",
				Aliases: []string{"d"},
				Action: func(c *cli.Context) error {
					bssk, err := os.ReadFile(c.String("secretkey"))
					if err != nil {
						return err
					}
					sk, err := ckks.FromBase64String[rlwe.SecretKey](string(bssk))
					if err != nil {
						return err
					}
					dec, err := ckks.NewCalculatorUsingSecretkey(sk)
					if err != nil {
						return err
					}

					bufSize := 5 * 1024 * 1024
					scanner := bufio.NewScanner(os.Stdin)
					buf := make([]byte, bufSize)
					scanner.Buffer(buf, bufSize)

					for scanner.Scan() {
						b64s := scanner.Text()
						bs, err := ckks.FromBase64String[rlwe.Ciphertext](b64s)
						if err != nil {
							return err
						}

						var v domain.CandidateVector
						v.DecyptRLWE(bs, dec)

						fmt.Printf("%#v\n", v)
					}
					if err := scanner.Err(); err != nil {
						return err
					}

					return nil
				},
			},
		},
	}

	return &cli.App{
		Flags: []cli.Flag{
			&cli.StringFlag{
				Name:  "inputfile",
				Value: "cmd/entry/ES入力ファイルサンプル.csv",
				Usage: "入力ファイルcsv",
			},
		},
		Commands: []*cli.Command{profile, vector},
	}
}

func main() {
	app := Init()

	if err := app.Run(os.Args); err != nil {
		log.Fatal(err)
	}
}
