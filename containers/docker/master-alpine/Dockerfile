FROM alpine:3.7

RUN \
  apk add --update go git make gcc musl-dev linux-headers ca-certificates && \
  git clone --depth 1 --branch release/1.8 https://github.com/wuyazero/Elastos.Geth && \
  (cd Elastos.Geth && make geth) && \
  cp Elastos.Geth/build/bin/geth /geth && \
  apk del go git make gcc musl-dev linux-headers && \
  rm -rf /Elastos.Geth && rm -rf /var/cache/apk/*

EXPOSE 8545
EXPOSE 30303

ENTRYPOINT ["/geth"]
