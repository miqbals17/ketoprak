# Ketoprak 🤤

Repo ini berisi beberapa functionality shortcut untuk integrasi IoT ke dalam SIPGN.

**🔗 Download Build File di:** https://github.com/miqbals17/ketoprak/releases/download/v1.4.0/ketoprak-win.zip

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

Opsi 4 ini perlu ada file yang isinya daftar kode SPPG yang mau dicek ges. Kayak gimana filenya mint? Gini:

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

#### 5. Mapping RTSP ke SIPGN

Opsi 5 ini perlu ada 2 file yang isinya daftar kode SPPG yang mau dicek da file yang isinya daftar IP CCTV-nya ges. Kayak gimana filenya mint? Gini:

1. Bikin file yang isinya daftar kode SPPG, misal `sppg-code.txt`. Ini tinggal copas aja dari spreadsheetnya mas Mail.
   ```
   31.73.06.1002.08
   31.72.03.1003.11
   31.71.06.1002.01
   ```
2. Bikin file yang isinya daftar kode SPPG, misal `ip-cctv.txt`. Ini tinggal copas aja dari spreadsheetnya mas Mail.
   ```
   rtsp://admin:CCtvp3rv121$@10.24.14.70:554/md0_1	rtsp://admin:CCtvp3rv121$@10.24.14.71:554/md0_1	rtsp://admin:CCtvp3rv121$@10.24.14.72:554/md0_1	rtsp://admin:CCtvp3rv121$@10.24.14.73:554/md0_1	rtsp://admin:CCtvp3rv121$@10.24.14.74:554/md0_1
   rtsp://admin:CCtvp3rv121$@10.24.16.174/cam/realmonitor?channel=1&subtype=1	rtsp://admin:CCtvp3rv121$@10.24.16.177/cam/realmonitor?channel=1&subtype=1	rtsp://admin:CCtvp3rv121$@10.24.16.182/cam/realmonitor?channel=1&subtype=1	rtsp://admin:CCtvp3rv121$@10.24.16.169:554/md0_1	rtsp://admin:CCtvp3rv121$@10.24.16.170:554/md0_1
   rtsp://admin:CCtvp3rv121$@10.24.16.231/cam/realmonitor?channel=1&subtype=1	rtsp://admin:CCtvp3rv121$@10.24.16.234/cam/realmonitor?channel=1&subtype=1	rtsp://admin:CCtvp3rv121$@10.24.16.247/cam/realmonitor?channel=1&subtype=1	rtsp://admin:CCtvp3rv121$@10.24.16.233/cam/realmonitor?channel=1&subtype=1	rtsp://admin:CCtvp3rv121$@10.24.16.225/cam/realmonitor?channel=1&subtype=1
   ```
3. Perlu dipastiin ya ges, jumlah baris dari daftar Kode SPPG sama daftar IP CCTV wajib 'ain sama
4. Ntar bakal ngeproses tuh Mapping RTSP-nya, flow-nya:
   1. Sync SPPG
   2. Reset RTSP, which is bikin 1 CCTV dengan kamera `cam-reset`
   3. Mapping RTSP, which is mapping IP CCTV ke Kode SPPG terkait

> Proses ini bakal running well kalau SPPG di SIPGN-nya itu udah ada Edge Device-nya. Kalau belum bakal gagal, jadi kakak harus bikin dulu langsung di Webnya SIPGN.
>
> **Kenapa ngga sekalian di script ini aja mint?**
>
> Jadi gini ges, di SIPGN itu id Edge Device digenerate di frontendnya. Nah ini, jujur ana belum tahu algoritma yang dipake buat generate id-nya. Soon kalau udah tahu, bakal diupdate lagi ya (kalau ngga mager)

5. Jangan lupa ges, khususon opsi 5 ini bakal ngubah data di sistem, ngga cuma read aja. Jadi perlu make sure lagi ya hasilnya

### Ada Kendala Waktu Running? Hubungi 112 (Call Center Damkar Jakarta)
