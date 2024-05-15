package ckks

import (
	"log"
	"math"
	"os"
	"testing"

	"github.com/tuneinsight/lattigo/v4/ckks"
	"github.com/tuneinsight/lattigo/v4/rlwe"
)

var dec *CalculatorUsingSecretkey
var enc *CalculatorUsingPublickeyEval

func TestMain(m *testing.M) {
	var err error
	params, err := ckks.NewParametersFromLiteral(CkksParams)
	if err != nil {
		panic(err)
	}

	kgenN12 := ckks.NewKeyGenerator(params)
	skN12, _ := kgenN12.GenKeyPair()

	dec, err = NewCalculatorUsingSecretkey(skN12)
	if err != nil {
		panic(err)
	}
	enc, err = dec.NewCalculatorUsingPublickey(RotateRange{From: -5, To: 30})
	if err != nil {
		panic(err)
	}

	exitVal := m.Run()
	os.Exit(exitVal)
}

func Test暗号化と復号化(t *testing.T) {
	log.Println("Test暗号化と復号化 running")

	elSize := 30

	vIn := enc.NewVector()
	for i := 0; i < elSize; i++ {
		vIn[i] = float64(i + 1)
	}

	ctIn := enc.Encrypt(vIn)
	vOut := dec.Decrypt(ctIn)

	for i := 0; i < elSize; i++ {
		expect := vIn[i]
		actual := float64(real(vOut[i]))
		if !(math.Abs(expect-actual) < 0.0001) {
			t.Errorf("[%d] FAILED expected: %+v, actual %+v", i, expect, actual)
		} else {
			// log.Printf("[%d] PASSED expected: %+v, actual %+v", i, expect, actual)
		}
	}
}

func TestMerge(t *testing.T) {
	log.Println("TestMerge running")

	vIns := make([][]float64, 5, 5)
	for i := 0; i < 5; i++ {
		vIns[i] = enc.NewVector()
		vIns[i][0] = float64(i+1) * 10
	}

	ctIns := make([]*rlwe.Ciphertext, len(vIns), len(vIns))
	for i, v := range vIns {
		ctIns[i] = enc.Encrypt(v)
	}

	ctOut := enc.Merge(ctIns)
	vOut := dec.Decrypt(ctOut)

	cases := []struct {
		Expect float64
		Actual float64
	}{
		{10.0, float64(real(vOut[0]))},
		{20.0, float64(real(vOut[1]))},
		{30.0, float64(real(vOut[2]))},
		{40.0, float64(real(vOut[3]))},
		{50.0, float64(real(vOut[4]))},
	}

	for i, c := range cases {
		actual := c.Actual
		expect := c.Expect
		if !(math.Abs(expect-actual) < 0.0001) {
			t.Errorf("[%d] FAILED input: %+v, expected: %+v, actual %+v", i, vIns[i][0], expect, actual)
		} else {
			// log.Printf("[%d] PASSED input: %+v, expected: %+v, actual %+v", i, vIns[i][0], expect, actual)
		}
	}

}
