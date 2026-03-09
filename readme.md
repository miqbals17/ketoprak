# Ketoprak 🤤

Repo ini berisi beberapa functionality shortcut untuk integrasi IoT ke dalam SIPGN.

🔗 Download file hasil build di:

## Syarat Sah Makan Ketoprak

Biar bisa pake nih program, sampeyan harus provide 1 file wajib 'ain, yaitu kerupuk. Caranya:

1. Bikin file namanya bebas, misal aja `kerupuk.txt`
2. Isinya apa aja mint? Nah, isinya buat baris pertama copas `Cookies` dari Jumpcloud ente dan baris kedua copas `Bearer Token` dari SIPGN (tanpa prefix Bearer)
3. Nih contohnya kek gini ntar

```
_ga=GA1.2.1019471848.1771764256; ajs_user_id=95ad15c57c38241fd09ab0802f9f45f08d32da330a2f09367c49186a371450ec; ajs_anonymous_id=eed1d803-3b46-4e76-9a61-e783c1c37020; ajs_group_id=d12589ebb073ea02144218097b9834b5812ef39c732915bc0915809cc396953a; intercom-device-id-wgmb0rm8=05b9aab9-0773-4131-bed8-329c482197dd; _gid=GA1.2.737051176.1772955261; jc_prevLoginType=admin; _jumpcloud_partition=0; _xsrf=bUkwZ0NSV0pZNXJvSHNPU0c3bWkxZjBVMTZvajRhV0w=|1773023374674751908|b8614c1197cc241fc68d2dd1c0ef19d10a74005ee3d437b659fef1ac89b47c29; _gat=1; _jumpcloud_=s%3AQshmC7RxL-b9RVI5uK6axjDB5ZrP-1tV.ffW5OHaw%2BsAYWsWmYG3nmUmGwtaW0U8TQn00uWLDyOo; _jumpcloud_user_console_=3bf24dcc3f2bd1c82fafda6b430bbf40; intercom-session-wgmb0rm8=d0Q2UXcxdnJyZnJmcWYwYTJDSWtvRHlkYzM2a0NTTFBoZVlwOGU5VFZXaVMxVG5UTk5nTEJSSFRaQmpLUDdwWXlBVDNucW9ndEt2Q1JHSm1XclpyVjd6MU1HVVo5R1k5a2ZBZlRxdjVGZm5IM09DS3BvOEprZTdRdC9lZk5wbTEzVHo5c1pPdXI1K3ZTYlg0WjJxZk5rcTFVL3YwR0RiemtKNTQ2Q1p4VUxkWDh4M2JwUUwvdVZUZXZPR3hYaG5GQ3pGMWRqMUVBdlBmMyt4KzQ4QWVhTGd3UjZsWXhQaHBiVnJabDRxdEVVYz0tLWg5aDY0eFFNT1BmZnAwZmIrNWZMeWc9PQ==--4a37808ca070ac6c3b37c581aa1b119e6ad9a143; _dd_s=logs=1&id=f7df075c-5956-4447-98de-c3aa4a5dfb76&created=1773061458878&expire=1773062414013&rum=0
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ2.eyJlEHAiOjE3NzMwOTU4MjIsInJvbGUiOiJzdXBlcmFkbWluIiwic2Vzc2lvbl9pZCI6IjUwMTliN2U0LWY4MDItNDUwOC1iZTY3LWQ1YjRjMmRjODFmYyIsInNwcGdfY29kZSI6IiIsInN1YiI6NDksInR5cGUiOiJhY2Nlc3MifQ.Y2pKMUVWHuIPHk7u9doOBjt3ruCIgb_-D4TAMHDLIxH
```

4. Sebenernya tinggal pilih, kalau mau pake program yang cuma butuh Jumpcloud, tinggal provide `Cookies`-nya aja, kalau SIPGN tinggal `Bearer Token`-nya aja. Tapi pastiin barisnya tetep ya baris 1 buat `Cookies`, baris 2 buat `Bearer Token`

## Petunjuk Makan Ketoprak

Jangan lupa, buka file sesuai OS saudara, kalau `Windows` pakai `ketoprak-win.exe`, kalau `Macbook` pakai `ketoprak-mac`.

### Beberapa opsi yang disupport:

#### 1. Cek Status JC By SPPG Name

Tinggal masukin nama SPPG di terminalnya, ntar muncul Online ato Offline JC-nya

#### 2. Cek Status JC Bulk

Opsi 2 ini perlu ada file yang isinya daftar SPPG yang mau dicek. Kayak gimana filenya mint? Gini:

1. Bikin file yang isinya daftar SPPG yang dipisahin pake `Enter`, misal `sppg.txt`
2. Lokasi file ini harus setara sama file executablenya (`ketoprak-win.exe`/`ketoprak-mac`)

```
.
├── ketoprak-mac
└── sppg.txt
```

3. Contoh isi filenya kek gini

```
SPPG-3863 SPPG Pandeglang Koroncong Bangkonol
Not Found
SPPG-3656
SPPG-1418
SPPG-0708
SPPG-1820
SPPG-3472
```

4. Ntar bakal muncul semua, offline apa online JC-nya.
