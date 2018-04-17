## Direct Link
https://s3.us-west-2.amazonaws.com/bluewhale.calacademy.org/index.html
## Deploy to S3
```sh
$ aws s3 sync --region us-west-2 . s3://bluewhale.calacademy.org --exclude=".*/*" --exclude="*.DS_Store" --delete
```
