# Ketoprak 🤤

Repo ini berisi beberapa functionality shortcut untuk integrasi IoT ke dalam SIPGN.

**🔗 Download Build File di:** https://github.com/miqbals17/ketoprak/releases/download/v1.3.1/ketoprak-win.zip

## Syarat Sah Makan Ketoprak [Updated 🎉]

Oke ges, sekarang ngga perlu copas-copas `Cookies` dari Jumpcloud sama `Token` dari SIPGN yak. Langsung cus login aja pake akun masing-masing

Dijamin 100% Aman ges, scriptnya ngga ada sniffing Password

> Aldis Burger cempaka putih rotinya lembut dagingnya juicy luicy mahalini rizky febian bisa pesen online!

## Petunjuk Makan Ketoprak

User `Windows` bisa langsung nikmatin dengan download build file di link diatas. Tapi kalau user `Mac` harus ngracik manual di local yee, stepnya:

1. Clone repo ini
2. Buat buildnya pake runtime `Bun`
3. Jalanin `bun build ./index.js --compile --target=bun-darwin-arm64 --outfile=ketoprak-mac`

### Beberapa opsi yang disupport:

#### 1. Cek Status JC By SPPG Name

Tinggal masukin nama SPPG di terminalnya, ntar muncul Online ato Offline JC-nya

#### 2. Cek Status JC Bulk

Opsi 2 ini perlu ada file yang isinya daftar SPPG yang mau dicek. Kayak gimana filenya mint? Gini:

1. Bikin file yang isinya daftar SPPG yang dipisahin pake `Enter`, misal `sppg.txt`
2. Lokasi file ini harus setara sama file executablenya (`ketoprak-win.exe`)

```
.
├── ketoprak-win.exe
└── sppg.txt
```

3. Contoh isi filenya kek gini

```
SPPG-0708
SPPG-1820
SPPG-3472
```

4. Ntar bakal muncul semua, offline apa online JC-nya.

#### 3. Cek Pemantauan CCTV by SPPG Code

Tinggal masukin kode SPPG di terminalnya, ntar bakal diinfoin kalo SPPG-nya udah muncul di Pemantauan CCTV atau belum

#### 4. Cek Pemantauan CCTV Bulk

Opsi 2 ini perlu ada file yang isinya daftar kode SPPG yang mau dicek ges. Kayak gimana filenya mint? Gini:

1. Bikin file yang isinya daftar SPPG yang dipisahin pake `Enter`, misal `sppg-code.txt`
2. Lokasi file ini harus setara sama file executablenya (`ketoprak-win.exe`)

```
.
├── ketoprak-win.exe
└── sppg-code.txt
```

3. Contoh isi filenya kek gini. Dari spreadsheetnya mas Mail, tinggal copas aja kolomnya sampai baris yang pengen dicek

```
32.75.11.1003.05
32.75.05.1004.01
32.75.05.1001.02
```

4. Ntar bakal muncul semua, yang udah muncul atau belum di Pemantauan CCTV.

### 5. Mapping RTSP ke SIPGN (Beta)

**🏗️ Work In Progress**
