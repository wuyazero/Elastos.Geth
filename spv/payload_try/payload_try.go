package main

import (
	"bytes"
	"encoding/hex"
	"fmt"

	ela "github.com/elastos/Elastos.ELA/core"
)

func main() {
	fmt.Println("Hello!")
	md, _ := hex.DecodeString("0122456655327667454d5a706d41556557557a4d73545a726561676169683868413176630060a2fa0200000000")
	fmt.Println(md)
	fmt.Println("World!")
	pl := new(ela.PayloadTransferCrossChainAsset)
	buf := bytes.NewBuffer(md)
	pl.Deserialize(buf, 0)
	fmt.Println(pl)
}
