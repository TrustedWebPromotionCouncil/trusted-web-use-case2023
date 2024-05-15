package ckks

import (
	"log"

	"github.com/tuneinsight/lattigo/v4/ckks"
	"github.com/tuneinsight/lattigo/v4/rlwe"
)

type CalculatorUsingSecretkey struct {
	params    ckks.Parameters
	keygen    rlwe.KeyGenerator
	encoder   ckks.Encoder
	decryptor rlwe.Decryptor

	secretkey *rlwe.SecretKey
}

// ベクトル回転させる範囲
type RotateRange struct {
	From, To int
}

func NewCalculatorUsingSecretkey(sk *rlwe.SecretKey) (*CalculatorUsingSecretkey, error) {
	params, err := ckks.NewParametersFromLiteral(CkksParams)
	if err != nil {
		return nil, err
	}

	dec := CalculatorUsingSecretkey{
		params:    params,
		keygen:    ckks.NewKeyGenerator(params),
		encoder:   ckks.NewEncoder(params),
		decryptor: ckks.NewDecryptor(params, sk),

		secretkey: sk,
	}

	return &dec, nil
}

func (d CalculatorUsingSecretkey) NewCalculatorUsingPublickey(r RotateRange) (*CalculatorUsingPublickeyEval, error) {
	return NewCalculatorUsingPublickeyEval(
		d.GenPublicKey(),
		d.GenRotateKey(r),
		d.GenRelinkey(),
	)
}

func (d CalculatorUsingSecretkey) Decrypt(ct *rlwe.Ciphertext) []complex128 {
	return d.encoder.Decode(d.decryptor.DecryptNew(ct), d.params.LogSlots())
}

func (c CalculatorUsingSecretkey) DebugShow(ct *rlwe.Ciphertext, size int) {
	log.Println("==================")
	d := c.encoder.Decode(c.decryptor.DecryptNew(ct), c.params.LogSlots())
	v := []float64{}
	for i := 0; i < size; i++ {
		v = append(v, float64(real(d[i])))
	}
	log.Println(v)
}

func (c CalculatorUsingSecretkey) GenPublicKey() *rlwe.PublicKey {
	return c.keygen.GenPublicKey(c.secretkey)
}

func (_ CalculatorUsingSecretkey) rotateGlElem(from, to int) []int {
	rotations := []int{}
	for i := from; i < to; i++ {
		rotations = append(rotations, i)
	}
	return rotations
}

// rotRangeFrom: 右回転を行う数。負の値を指定
// rotRangeTo: 左回転を行う数。
func (c CalculatorUsingSecretkey) GenRotateKey(r RotateRange) *rlwe.RotationKeySet {
	return c.keygen.GenRotationKeysForRotations(c.rotateGlElem(r.From, r.To), true, c.secretkey)
}

func (c CalculatorUsingSecretkey) GenRelinkey() *rlwe.RelinearizationKey {
	return c.keygen.GenRelinearizationKey(c.secretkey, 1)
}
