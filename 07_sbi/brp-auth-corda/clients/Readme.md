# Corda APIs

### Tests for Auth Org VC Generation APIs

```
curl -X GET http://brp-corda-webapi:8087/brp/corda/get-my-identity

docker compose up 
curl -X GET http://brp-corda-webapi:8087/brp/corda/get-my-role   

curl -X GET http://brp-corda-webapi:8087/brp/corda/get-corda-network-info

curl -X POST \
  http://brp-corda-webapi:8087/brp/corda/vc-json \
  -H 'Content-Type: application/json' \
  -d '{
    "authOrgName": "VCAuthOrg",
    "vcID": "VCAuthOrgConsortium000002-vcIDTest001",
    "validityPeriod": 31536000
  }'

curl -X POST \
  http://brp-corda-webapi:8089/brp/corda/vc-json \
  -H 'Content-Type: application/json' \
  -d '{
    "authOrgName": "VCAuthOrg",
    "vcID": "VCAuthCom2-vcIDTest001",
    "validityPeriod": 31536000
  }'
 
curl -X GET http://brp-corda-webapi:8085/brp/corda/vc-json-list  && echo ""  
curl -X GET http://brp-corda-webapi:8086/brp/corda/vc-json-list  && echo ""  
curl -X GET http://brp-corda-webapi:8087/brp/corda/vc-json-list  && echo ""  
curl -X GET http://brp-corda-webapi:8088/brp/corda/vc-json-list  && echo ""  
curl -X GET http://brp-corda-webapi:8089/brp/corda/vc-json-list  && echo ""  

curl -X GET http://brp-corda-webapi:8085/brp/corda/vc-json-list-for-auth-consortium  && echo ""  

curl -X GET http://brp-corda-webapi:8085/brp/corda/vc-json-list-for-auth-company  && echo ""  

```

### Tests for VC Revocation APIs
```
curl -X POST http://brp-corda-webapi:8089/brp/corda/revocation/vc
export uuid="2e29e1a2-2011-49e1-bc61-d6ff6eb5e4fe"

curl -X GET http://brp-corda-webapi:8086/brp/corda/revocation/vc-status/$uuid
curl -X GET http://brp-corda-webapi:8087/brp/corda/revocation/vc-status/$uuid

curl -X PUT http://brp-corda-webapi:8089/brp/corda/revocation/vc/$uuid
export uuid="35df4fcc-c474-4fe0-a81d-fa904180e6da"

curl -X DELETE http://brp-corda-webapi:8089/brp/corda/revocation/vc/$uuid

curl -X GET http://brp-corda-webapi:8086/brp/corda/revocation/vc-valid-list
curl -X GET http://brp-corda-webapi:8087/brp/corda/revocation/vc-valid-list
curl -X GET http://brp-corda-webapi:8088/brp/corda/revocation/vc-valid-list
curl -X GET http://brp-corda-webapi:8089/brp/corda/revocation/vc-valid-list

curl -X GET http://brp-corda-webapi:8086/brp/corda/revocation/vc-revoked-list
curl -X GET http://brp-corda-webapi:8087/brp/corda/revocation/vc-revoked-list
curl -X GET http://brp-corda-webapi:8088/brp/corda/revocation/vc-revoked-list
curl -X GET http://brp-corda-webapi:8089/brp/corda/revocation/vc-revoked-list


```