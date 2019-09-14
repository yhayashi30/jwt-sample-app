## prepare

$ openssl genrsa 2048 > myapp.pem  
$ openssl req -new -key myapp.pem -out myapp.csr  
(..snip..)  
$ openssl x509 -req -days 365 -in myapp.csr -signkey myapp.pem -out myapp.crt  

## reference
https://qiita.com/stomita/items/4542ce1b48e5fa849ef1
