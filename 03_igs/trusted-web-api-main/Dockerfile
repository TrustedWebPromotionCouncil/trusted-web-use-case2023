# syntax = docker/dockerfile:experimental

# Base
FROM golang:1.20-bullseye as base
RUN apt-get -y update
## locale日本語化
RUN apt-get install -y locales && \
    echo "ja_JP.UTF-8 UTF-8" > /etc/locale.gen && \
    rm -rf /var/lib/apt/lists/* && \
    localedef -i ja_JP -c -f UTF-8 -A /usr/share/locale/locale.alias ja_JP.UTF-8
ENV LANG ja_JP.utf8
## タイムゾーンをJSTに変更
RUN ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime
## Workspace共通で必要なモジュール 
RUN go install github.com/swaggo/swag/cmd/swag@v1.7.4
## go.mod にてprivate repository参照時に必要な設定
## (git config関連設定は .gitconfig に記載してます)
ENV GOPRIVATE=github.com/Institution-for-a-Global-Society
RUN mkdir -p -m 0600 /root/.ssh && \
    ssh-keyscan -H github.com >> /root/.ssh/known_hosts 

# Development
FROM base as development
WORKDIR /root/app
RUN go install github.com/swaggo/swag/cmd/swag@v1.7.4 && \
    go install golang.org/x/tools/gopls@latest && \
    go install github.com/go-delve/delve/cmd/dlv@v1.8.2 && \
    go install github.com/rubenv/sql-migrate/...@v1.1.1 && \
    go install github.com/golang/mock/mockgen@v1.5.0 && \
    go install golang.org/x/tools/cmd/godoc@v0.1.10 && \
    go install github.com/kyoh86/richgo@v0.3.10 && \
    curl -sSfL https://raw.githubusercontent.com/cosmtrek/air/master/install.sh | sh -s -- -b /usr/local/bin

# Build
FROM base as build
COPY . /root/app
WORKDIR /root/app
ENV GOSUMDB=off
ENV GOOS=linux
ENV CGO_ENABLED=0
RUN git config --global url."git@github.com:".insteadOf https://github.com
RUN --mount=type=ssh go build -o /go/bin/app ./cmd/serve/main.go
RUN --mount=type=ssh go build -o /go/bin/matching_generate_keys ./cmd/matching/generate_keys/main.go
RUN --mount=type=ssh go build -o /go/bin/matching_generate_weights ./cmd/matching/generate_weights/main.go

# # Release 
FROM gcr.io/distroless/cc-debian11 as release
COPY --chown=nonroot:nonroot --from=build /go/bin/app /
COPY --chown=nonroot:nonroot --from=build /go/bin/matching_generate_keys /
COPY --chown=nonroot:nonroot --from=build /go/bin/matching_generate_weights /
COPY --chown=nonroot:nonroot --from=build /tmp/ /tmp/
USER nonroot
CMD ["/app"]
EXPOSE 3000
