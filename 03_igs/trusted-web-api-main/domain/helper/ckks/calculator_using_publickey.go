package ckks

import (
	"github.com/tuneinsight/lattigo/v4/ckks"
	"github.com/tuneinsight/lattigo/v4/rlwe"
)

type CalculatorUsingPublickey struct {
	params    ckks.Parameters
	encoder   ckks.Encoder
	encryptor rlwe.Encryptor

	publickey *rlwe.PublicKey
}

type CalculatorUsingPublickeyEval struct {
	CalculatorUsingPublickey

	rotkey   *rlwe.RotationKeySet
	relinkey *rlwe.RelinearizationKey
}

func NewCalculatorUsingPublickey(pk *rlwe.PublicKey) (*CalculatorUsingPublickey, error) {
	params, err := ckks.NewParametersFromLiteral(CkksParams)
	if err != nil {
		return nil, err
	}

	enc := CalculatorUsingPublickey{
		params:    params,
		encoder:   ckks.NewEncoder(params),
		encryptor: ckks.NewEncryptor(params, pk),

		publickey: pk,
	}

	return &enc, nil
}

func NewCalculatorUsingPublickeyEval(pk *rlwe.PublicKey, rotkey *rlwe.RotationKeySet, relinkey *rlwe.RelinearizationKey) (*CalculatorUsingPublickeyEval, error) {
	params, err := ckks.NewParametersFromLiteral(CkksParams)
	if err != nil {
		return nil, err
	}

	enc := CalculatorUsingPublickeyEval{
		CalculatorUsingPublickey: CalculatorUsingPublickey{
			params:    params,
			encoder:   ckks.NewEncoder(params),
			encryptor: ckks.NewEncryptor(params, pk),

			publickey: pk,
		},

		rotkey:   rotkey,
		relinkey: relinkey,
	}

	return &enc, nil
}

func (e CalculatorUsingPublickey) NewVector() []float64 {
	return make([]float64, e.params.Slots())
}

func (c CalculatorUsingPublickey) Encrypt(v []float64) *rlwe.Ciphertext {
	pt := ckks.NewPlaintext(c.params, c.params.MaxLevel())
	c.encoder.EncodeSlots(v, pt, c.params.LogSlots())

	ct := c.encryptor.EncryptNew(pt)
	return ct
}

func (e CalculatorUsingPublickeyEval) getEvaluator() ckks.Evaluator {
	return ckks.NewEvaluator(e.params, rlwe.EvaluationKey{Rlk: e.relinkey, Rtks: e.rotkey})
}

// 内積計算
func (c CalculatorUsingPublickeyEval) DotProduct(ct1, ct2 *rlwe.Ciphertext, rotSize int) *rlwe.Ciphertext {
	ev := c.getEvaluator()

	ctMult := ev.MulRelinNew(ct1, ct2)
	ctSum := ckks.NewCiphertext(c.params, ctMult.Degree(), ctMult.Level())
	ev.InnerSum(ctMult, 1, rotSize, ctSum)

	return ctSum
}

// ベクトル積
func (c CalculatorUsingPublickeyEval) Multiple(ct1, ct2 *rlwe.Ciphertext) *rlwe.Ciphertext {
	ev := c.getEvaluator()
	return ev.MulRelinNew(ct1, ct2)
}

type IndexRange struct {
	From, To int
}

// ベクトルの特定範囲の和
// 特定範囲の和 [from, to) を計算して新規ベクトルにして返却
func (c CalculatorUsingPublickeyEval) RangeSum(ct *rlwe.Ciphertext, r IndexRange) *rlwe.Ciphertext {
	ev := c.getEvaluator()

	ctRet := ckks.NewCiphertext(c.params, ct.Degree(), ct.Level())
	for i := r.From; i < r.To; i++ {
		ctNew := ev.RotateNew(ct, i)
		ev.Add(ctRet, ctNew, ctRet)
	}

	return ctRet
}

// ベクトルの特定範囲の和。複数対応。
func (c CalculatorUsingPublickeyEval) RangeSums(ct *rlwe.Ciphertext, rs []IndexRange) []*rlwe.Ciphertext {
	ctRets := make([]*rlwe.Ciphertext, len(rs), len(rs))

	for j, r := range rs {
		ctRets[j] = c.RangeSum(ct, r)
	}

	return ctRets
}

// 各ベクトルの v[0] を新規のベクトルに詰め直して返す
// 暗号化ベクトルの右回転を行う
// 結果のインデックスは渡したベクトルと同順
func (c CalculatorUsingPublickeyEval) Merge(cts []*rlwe.Ciphertext) *rlwe.Ciphertext {
	ev := c.getEvaluator()

	ctOne := func() *rlwe.Ciphertext {
		vec := make([]float64, c.params.Slots())
		vec[0] = 1.0

		pt := ckks.NewPlaintext(c.params, c.params.MaxLevel())
		c.encoder.EncodeSlots(vec, pt, c.params.LogSlots())
		return c.encryptor.EncryptNew(pt)
	}()

	ctResult := ckks.NewCiphertext(c.params, ctOne.Degree(), ctOne.Level())
	for i, ct := range cts {
		rot := -i
		ctMult := ev.MulRelinNew(ct, ctOne)
		ctRot := ev.RotateNew(ctMult, rot)
		ev.Add(ctResult, ctRot, ctResult)
	}

	return ctResult
}
