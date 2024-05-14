# コーディング

GPT (Cursor) による、設計からの多言語（Javascript, Python）自動コーディング デモ です。

### 設計

下記による設計

- openapi
- mermaid - classDiagram

[ファイル](./architecture_001.md)

## コード生成

prompt には下記を書き込んでいる

- タスク
- mermaid から Javascript・Python への変換例

### Javascript コードの生成

- GitHub Copilot, Cursor で `architecture_001.md` を開く。
- Chat で prompt_js_001 をメンション `@prompt_js_001.md`。
- プロンプト実行で、GPT-4 で設計からコードが生成される。

### Python コードの生成

- GitHub Copilot, Cursor で `architecture_001.md` を開く。
- Chat で prompt_js_001 をメンション `@prompt_js_001.md`。
- プロンプト実行で、GPT-4 で設計からコードが生成される。

## デモ

OpenAPI の Mock Server (Prism) を起動して、生成したコードの動作デモを実行

### OpenAPI の Mock Server (Prism) 起動

- Prism 起動

```sh
cd architecture/api; docker run --rm -it -p 4010:4010 -v $PWD:/tmp stoplight/prism:4 mock -h 0.0.0.0 /tmp/openapi.yaml
```

- Prism 動作確認

```sh
curl localhost:4010/users
```

- Prism output

```json
[
  { "id": 1, "name": "いちろう", "birthday": "2021-07-16" },
  { "id": 2, "name": "じろう", "birthday": "2022-08-20" },
  { "id": 3, "name": "さぶろう", "birthday": "2023-01-01" }
]
```

### Javascript デモ

- デモ 実行

```sh
node demo/js/demo_001.js
```

- デモ output

```sh
$ node demo/js/demo_001.js
--- test001 ---
url: http://localhost:4010/users
private var: undefined
user: {"id":1,"name":"いちろう","birthday":"2021-07-16T00:00:00.000Z"}
age: 2
user: {"id":2,"name":"じろう","birthday":"2022-08-20T00:00:00.000Z"}
age: 1
--- test002 ---
url: http://localhost:4010/
error Error: ERROR
    at UserService.fetch (/Users/hideyukimachida/git/Project/cording/demo/js/demo_001.js:52:13)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async main (/Users/hideyukimachida/git/Project/cording/demo/js/demo_001.js:126:5)
```

### Python デモ

- デモ 実行

```sh
python demo/python/demo_001.py
```

- デモ output

```sh
$ python demo/python/demo_001.py
--- test001 ---
url: http://localhost:4010/users
user: User(id=1, name='いちろう', birthday=datetime.datetime(2021, 7, 16, 0, 0))
age: 2
user: User(id=2, name='じろう', birthday=datetime.datetime(2022, 8, 20, 0, 0))
age: 1
--- test002 ---
url: http://localhost:4010/
error ERROR: Client error '404 Not Found' for url 'http://localhost:4010/'
For more information check: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404
```
