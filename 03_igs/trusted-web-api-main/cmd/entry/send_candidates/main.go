package main

import (
	"log"
	"os"

	"github.com/Institution-for-a-Global-Society/trusted-web-api/domain/entry"
	"github.com/urfave/cli/v2"
)

func Init() *cli.App {
	planX := &cli.Command{
		Name:        "planX",
		Aliases:     []string{"x"},
		Description: "候補者送信 planX",
		Action: func(c *cli.Context) error {
			inputfile := c.String("inputfile")
			matchingEndpoint := c.String("matchingEndpoint")
			processingEndpoint := c.String("processingEndpoint")

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
				log.Printf("-------------------------- send candidate planX --------------------------\n")
				log.Printf("%#v\n", v.Record)

				cli, err := entry.NewEntryClientPlanX(matchingEndpoint, processingEndpoint)
				if err != nil {
					return err
				}
				log.Printf("New UserId: %#v\n", cli.UserId)

				// 暗号化プロフィール送信
				err = cli.SaveProfileData(v.Record.CandidateProfile)
				if err != nil {
					return err
				}

				// 暗号化ベクトル送信
				err = cli.RunCalculator(v.Record.CandidateVector)
				if err != nil {
					return err
				}

				log.Printf("Succeeded UserId: %#v\n", cli.UserId)
			}

			return nil
		},
	}

	planY := &cli.Command{
		Name:        "planY",
		Aliases:     []string{"y"},
		Description: "候補者送信 planY",
		Action: func(c *cli.Context) error {
			inputfile := c.String("inputfile")
			matchingEndpoint := c.String("matchingEndpoint")
			processingEndpoint := c.String("processingEndpoint")

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
				log.Printf("-------------------------- send candidate planY --------------------------\n")
				log.Printf("%#v\n", v.Record)

				cli, err := entry.NewEntryClientPlanY(matchingEndpoint, processingEndpoint)
				if err != nil {
					return err
				}
				log.Printf("New UserId: %#v\n", cli.UserId)

				// 暗号化計算実行
				result, err := cli.RunCalculator(v.Record.CandidateVector)
				if err != nil {
					return err
				}

				// 計算結果復号化
				resultPlain, err := cli.DecryptResult(&result)
				if err != nil {
					return err
				}
				log.Println("計算結果復号化>>>")
				log.Printf("%#v", resultPlain.Vector)
				log.Printf("%#v", resultPlain.Result)
				log.Println("NOTE: 本来ではここで候補者本人に送信して良いか確認が入る")

				// 結果保存
				err = cli.SaveResult(v.Record.CandidateProfile, resultPlain)
				if err != nil {
					return err
				}

				log.Printf("Succeeded UserId: %#v\n", cli.UserId)
			}

			return nil
		},
	}

	return &cli.App{
		Flags: []cli.Flag{
			&cli.StringFlag{
				Name:  "inputfile",
				Value: "cmd/entry/ES入力ファイルサンプル.csv",
				Usage: "入力ファイルcsv",
			},
			&cli.StringFlag{
				Name:  "matchingEndpoint",
				Value: "http://localhost:10000/api/matching",
				Usage: "matchingシステムのエンドポイント",
			},
			&cli.StringFlag{
				Name:  "processingEndpoint",
				Value: "http://localhost:10000/api/processing",
				Usage: "processingシステムのエンドポイント",
			},
		},
		Commands: []*cli.Command{planX, planY},
	}
}

func main() {
	app := Init()

	if err := app.Run(os.Args); err != nil {
		log.Fatal(err)
	}
}
