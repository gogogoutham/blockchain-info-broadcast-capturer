blockchain-info-broadcast-capturer
==================================

node.js program for capturing unconfirmed transaction and block broadcasts into a PostgreSQL database.

Installation
============

a) Clone my fork of the blockchain package:
```bash

git clone https://github.com/gseshadri/blockchain.git <my-local-dir>/blockchain
```

b) Resolve depedencies:

```bash

npm install pg sql <my-local-dir>/blockchain
```

c) Create tables in target PostgreSQL DB (see sql/)

d) Create .pgpass file in top-level of this directory containing connection info to the DB from step 3. Use the following format (9.1):

http://www.postgresql.org/docs/9.1/static/libpq-pgpass.html

Usage
=====

Simply execute run.js in node. This program is designed to always run, so you may wish to start it in the background.
