/* eslint-disable no-unused-vars */
import { PrismaClient, ShippingStatusType, Rank, ContractDocumentStatusType, ContractVpStatusType } from '@prisma/client'
import bcrypt from 'bcrypt'
import { generateKeyPairSync } from 'crypto'
import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';

const prisma = new PrismaClient()
function generateEd25519KeyPair() {
  const keyPair = nacl.sign.keyPair();
  return {
    publicKey: naclUtil.encodeBase64(keyPair.publicKey),
    privateKey: naclUtil.encodeBase64(keyPair.secretKey)
  };
}

async function main() {
  const entityA = await prisma.legalEntity.create({
    data: { 
      name: 'メーカーA', 
      color: '#008080',
      identifier: '6010401045208'
    }
  })
  let { publicKey, privateKey } = generateEd25519KeyPair()
  const unitA = await prisma.businessUnit.create({
    data: {
      name: '第1営業部',
      domainName: 'unit1',
      did: 'did:example:z1BucZo4E61VN434Lny5SSBm1wDGjNrayfbRYsvfUkDVpB',
      legalEntityId: entityA.id,
      publicKey: publicKey,
      privateKey: privateKey,
      prefix: 'wpia',
      numberOfIssuedVc: 0,
      numberOfIssuedVp: 0,
    }
  })

  const alice = await prisma.user.create({
    data: {
      name: 'alice',
      email: 'alice@a.com',
      password: bcrypt.hashSync('Passw0rd', 10),
      businessUnitId: unitA.id,
    }
  })

  ;({ publicKey, privateKey } = generateEd25519KeyPair())
  const unitB = await prisma.businessUnit.create({
    data: {
      name: '第2営業部',
      domainName: 'unit2',
      did: 'did:example:z14R1Bty2tQkQ3y4peELCxUHzkS68YJb2B2FPWJCFzmSDM',
      prefix: 'wpia',
      legalEntityId: entityA.id,
      publicKey: publicKey,
      privateKey: privateKey,
      numberOfIssuedVc: 0,
      numberOfIssuedVp: 0,
    }
  })
  const bob = await prisma.user.create({
    data: {
      name: 'bob',
      email: 'bob@a.com',
      password: bcrypt.hashSync('Passw0rd', 10),
      businessUnitId: unitB.id
    }
  })

  const entityB = await prisma.legalEntity.create({
    data: { 
      name: '部品メーカーB',
      color: '#db7093',
      identifier: '3010401143550',
    }
  })

  ;({ publicKey, privateKey } = generateEd25519KeyPair())
  const unitC = await prisma.businessUnit.create({
    data: {
      name: '倉庫X',
      domainName: 'unitX',
      legalEntityId: entityB.id,
      did: 'did:example:z13CSc3TYd5hPa5AhV3yw5pqHDBVT7X911xhQtC62fct3Y',
      prefix: 'mrfb',
      publicKey: publicKey,
      privateKey: privateKey,
      numberOfIssuedVc: 0,
      numberOfIssuedVp: 0,
    }
  })

  const carol = await prisma.user.create({
    data: {
      name: 'carol',
      email: 'carol@a.com',
      password: bcrypt.hashSync('Passw0rd', 10),
      businessUnitId: unitC.id,
    }
  })

  ;({ publicKey, privateKey } = generateEd25519KeyPair())
  const unitD = await prisma.businessUnit.create({
    data: {
      name: '工場Y',
      domainName: 'unitY',
      legalEntityId: entityB.id,
      did: 'did:example:z1FXZptRq3Zc4s3gpQTxpwAqTcc72No25z2irhjZzNfw2C',
      prefix: 'mrfb',
      publicKey: publicKey,
      privateKey: privateKey,
      numberOfIssuedVc: 0,
      numberOfIssuedVp: 0,
    }
  })

  const dave = await prisma.user.create({
    data: {
      name: 'dave',
      email: 'dave@a.com',
      password: bcrypt.hashSync('Passw0rd', 10),
      businessUnitId: unitD.id,
    }
  })

  const entityC = await prisma.legalEntity.create({
    data: { 
      name: 'セミコンJ', 
      color: '#87ceeb',
      identifier: '4010401148508',
    }
  })

  ;({ publicKey, privateKey } = generateEd25519KeyPair())
  const unitE = await prisma.businessUnit.create({
    data: {
      name: '工場B',
      domainName: 'unitB',
      legalEntityId: entityC.id,
      did: 'did:example:z16QhPpnSA8yzr4hA4HwdYc4hWaUcTMnj1vF59poVZ8WM4',
      prefix: 'semj',
      publicKey: publicKey,
      privateKey: privateKey,
      numberOfIssuedVc: 0,
      numberOfIssuedVp: 0,
    }
  })

  const eve = await prisma.user.create({
    data: {
      name: 'eve',
      email: 'eve@a.com',
      password: bcrypt.hashSync('Passw0rd', 10),
      businessUnitId: unitE.id,
    }
  })

  ;({ publicKey, privateKey } = generateEd25519KeyPair())
  const unitF = await prisma.businessUnit.create({
    data: {
      name: '品質保証部',
      domainName: 'unitJ',
      legalEntityId: entityC.id,
      did: 'did:example:z1J8GyLBF5wRwDd6cUimFu4dXV9ahDR8U9eRvEXVzKRwGM',
      prefix: 'semj',
      publicKey: publicKey,
      privateKey: privateKey,
      numberOfIssuedVc: 0,
      numberOfIssuedVp: 0,
    }
  })

  const frank = await prisma.user.create({
    data: {
      name: 'frank',
      email: 'frank@a.com',
      password: bcrypt.hashSync('Passw0rd', 10),
      businessUnitId: unitF.id,
    }
  })

  const entityD = await prisma.legalEntity.create({
    data: {
      name: 'セミコンT',
      color: '#22ee22',
      identifier: '5010401141288'
    }
  })

  ;({ publicKey, privateKey } = generateEd25519KeyPair())
  const unitG = await prisma.businessUnit.create({
    data: {
      name: '工場Z',
      domainName: 'unitZ',
      legalEntityId: entityD.id,
      did: 'did:example:z1BW7G916cEnG77ncJLK9kZij6YVBFAUSpMJV3Cnko1SfH',
      prefix: 'semt',
      publicKey: publicKey,
      privateKey: privateKey,
      numberOfIssuedVc: 0,
      numberOfIssuedVp: 0,
    }
  })

  const john = await prisma.user.create({
    data: {
      name: 'zebra',
      email: 'zebra@a.com',
      password: bcrypt.hashSync('Passw0rd', 10),
      businessUnitId: unitG.id,
    }
  })

  const prodA = await prisma.product.create({
    data: {
      name: '電源ケーブル',
      number: 'Y-7-00001',
      businessUnitId : unitD.id,
    }
  })

  const lotA = await prisma.lot.create({
    data: {
      name: 'ロットY',
      number: 1,
      productId: prodA.id,
    }
  })

  const prodB = await prisma.product.create({
    data: {
      name: '電源ケーブル',
      number: 'X-7-00001',
      businessUnitId: unitC.id,
    }
  })

  const lotB = await prisma.lot.create({
    data: {
      name: 'ロットX',
      number: 1,
      productId: prodB.id,
    }
  })

  const prodC = await prisma.product.create({
    data: {
      name: '半導体チップ',
      number: 'B-5-00001',
      businessUnitId: unitE.id,
    }
  })

  const lotC1 = await prisma.lot.create({
    data: {
      name: 'ロットA',
      number: 1,
      productId: prodC.id,
    }
  })

  const lotC2 = await prisma.lot.create({
    data: {
      name: 'ロットB',
      number: 1,
      productId: prodC.id,
    }
  })

  const prodD = await prisma.product.create({
    data: {
      name: '半導体チップ',
      number: 'Z-5-00001',
      businessUnitId: unitG.id,
    }
  })

  const lotD = await prisma.lot.create({
    data: {
      name: 'ロットZ',
      number: 1,
      productId: prodD.id,
    }
  })

  await prisma.order.create({
    data: {
      shippingForId: unitA.id,
      status: ShippingStatusType.Before,
      lotId: lotA.id,
    }
  })

  await prisma.order.create({
    data: {
      shippingForId: unitA.id,
      shippingDate: new Date(2023, 10, 1, 10, 0, 0),
      quality: Rank.B,
      status: ShippingStatusType.Shipped,
      lotId: lotB.id,
    }
  })

  const entityP = await prisma.legalEntity.create({
    data: {
      name: '事業者P',
      color: '#0f52ba',
      identifier: '8010401141288',
    }
  })

  ;({ publicKey, privateKey } = generateEd25519KeyPair())
  const unitP = await prisma.businessUnit.create({
    data: {
      name: '工場P',
      domainName: 'semp',
      prefix: 'semp',
      did: 'did:example:z19XV7G916cEnG77ncJLK9kZij6YVBFAUSpMJV3Cnko1SfH',
      publicKey: publicKey,
      privateKey: privateKey,
      legalEntityId: entityP.id,
      numberOfIssuedVc: 0,
      numberOfIssuedVp: 0,
    }
  })

  const peter = await prisma.user.create({
    data: {
      email: 'peter@a.com',
      name: 'peter',
      password: bcrypt.hashSync('Passw0rd', 10),
      businessUnitId: unitP.id,
    }
  })

  const entityQ = await prisma.legalEntity.create({
    data: {
      name: '事業者Q',
      color: 'aliceblue',
      identifier: '9010401141288'
    }
  })

  ;({ publicKey, privateKey } = generateEd25519KeyPair())
  const unitQ = await prisma.businessUnit.create({
    data: {
      name: '事業所Q',
      domainName: 'semq',
      prefix: 'semq',
      did: 'did:example:z10KL9T916cEnG77ncJLK9kZij6YVBFAUSpMJV3Cnko1SfH',
      publicKey: publicKey,
      privateKey: privateKey,
      legalEntityId: entityQ.id,
      numberOfIssuedVc: 0,
      numberOfIssuedVp: 0,
    }
  })

  const entityR = await prisma.legalEntity.create({
    data: {
      name: '事業者R',
      color: '#b43757'
    }
  })

  ;({ publicKey, privateKey } = generateEd25519KeyPair())
  const unitR = await prisma.businessUnit.create({
    data: {
      name: '事業所R',
      domainName: 'semr',
      prefix: 'semr',
      did: 'did:example',
      publicKey: publicKey,
      privateKey: privateKey,
      legalEntityId: entityR.id,
      numberOfIssuedVc: 0,
      numberOfIssuedVp: 0,
    }
  })

  const romeo = await prisma.user.create({
    data: {
      email: 'romeo@a.com',
      name: 'romeo',
      password: bcrypt.hashSync('Passw0rd', 10),
      businessUnitId: unitR.id,
    }
  })

  const productE = await prisma.product.create({
    data: {
      name: '半導体',
      number: 'Q-5-00001',
      businessUnitId: unitQ.id,
    }
  })

  const lotE = await prisma.lot.create({
    data: {
      name: 'ロットQ',
      number: 1,
      productId: productE.id,
    }
  })

  const orderE = await prisma.order.create({
    data: {
      shippingForId: unitR.id,
      shippingDate: new Date(2024, 0, 15, 10, 0, 0),
      status: ShippingStatusType.Shipped,
      lotId: lotE.id
    }
  })

  const entityK = await prisma.legalEntity.create({
    data: {
      name: 'K Holdings',
      color: '#008080',
      identifier: '0010401141288'
    }
  })

  ;({ publicKey, privateKey } = generateEd25519KeyPair())
  const unitK = await prisma.businessUnit.create({
    data: {
      name: '事業所甲',
      domainName: 'semk',
      prefix: 'semk',
      did: 'did:example:z11XV7G916cEnG77ncJLK9kZij6YVBFAUSpMJV3Cnko1SfH',
      publicKey: publicKey,
      privateKey: privateKey,
      legalEntityId: entityK.id,
      numberOfIssuedVc: 0,
      numberOfIssuedVp: 0,

    }
  })

  const kylian = await prisma.user.create({
    data: {
      email: 'kylian@a.com',
      name: 'kylian',
      password: bcrypt.hashSync('Passw0rd', 10),
      businessUnitId: unitK.id,
    }
  })

  const entityO = await prisma.legalEntity.create({
    data: {
      name: 'O Corp.',
      color: '#db7093',
      identifier: '8960401045208'
    }
  })
  
  ;({ publicKey, privateKey } = generateEd25519KeyPair())
  const unitO = await prisma.businessUnit.create({
    data: {
      name: '事業所乙',
      domainName: 'semo',
      prefix: 'semo',
      did: 'did:example:asqNM68916cEnG77ncJLK9kZij6YVBFAUSpMJV3Cnko1SfH',
      publicKey: publicKey,
      privateKey: privateKey,
      legalEntityId: entityO.id,
      numberOfIssuedVc: 0,
      numberOfIssuedVp: 0,
    }
  })

  const oscar = await prisma.user.create({
    data: {
      email: 'oscar@a.com',
      name: 'oscar',
      password: bcrypt.hashSync('Passw0rd', 10),
      businessUnitId: unitO.id,
    }
  })

  const contractA =  await prisma.contract.create({
    data: {
      contractDate: null,
      partyAId: unitK.id,
      partyAVpStatus: ContractVpStatusType.PreRequest,
      partyBId: unitO.id,
      partyBVpStatus: ContractVpStatusType.PreRequest,
      contractDocumentStatus: ContractDocumentStatusType.PreReview,
    }
  })
  
  const contractB =  await prisma.contract.create({
    data: {
      contractDate: new Date (2023, 9, 10, 0, 0, 0),
      partyAId: unitK.id,
      partyAChallenge: "550e8400-e29b-41d4-a716-446655440000",
      partyAVpStatus: ContractVpStatusType.Verified,
      partyBId: unitP.id,
      partyBVpStatus: ContractVpStatusType.Verified,
      contractDocumentStatus: ContractDocumentStatusType.Reviewed,
    }
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })