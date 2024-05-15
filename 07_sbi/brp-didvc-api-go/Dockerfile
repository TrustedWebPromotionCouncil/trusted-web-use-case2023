# This is a multi-stage build. First we are going to compile and then
# create a small image for runtime.
FROM golang:1.20.3 as builder

RUN mkdir -p /go/src/brp-didvc-api-go
WORKDIR /go/src/brp-didvc-api-go
RUN useradd -u 10001 app
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

FROM alpine:latest

RUN apk update && apk upgrade
RUN apk --no-cache add tzdata
COPY --from=builder /go/src/brp-didvc-api-go/main /app/main
COPY --from=builder /etc/passwd /etc/passwd
COPY --from=builder /go/src/brp-didvc-api-go/init/ca-certificates.crt /app/ca-certificates.crt
USER app

EXPOSE 8080
CMD ["/app/main"]
