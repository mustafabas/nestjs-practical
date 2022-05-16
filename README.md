
## Reddit Simple Api
This project created with nest.js used mongodb. Purpose of project is providing reddits,users and posts. 
There are 3 job schedular to get data from reddit works in different times. 
- Getting Users works at the 30th minute of every hour
- Getting Reddit works at the 15th minute of every hour
- Getting Posts works at the 45th minute of every hour

In aditionally there are also initalizations for users and reddits. 


In the .env file, you can specify how long before the data is retrieved.
- HOUR_FOR_LAST_REDDITUSER_INITIALIZATION=1
- DAY_FOR_LAST_SUBREDDIT_INITIALIZATION=1

To start application;
- dev mode: docker-compose up dev
- prod mode :docker-compose up prod

#### Register User

```http
  POST /auth/signup
  Body 
  {
	"userName":"test9",
	"password":"te213123"
  }
```


| Parametre | Tip     | Açıklama                |
| :-------- | :------- | :------------------------- |
| `userName` | `string` | **Required**.  |
| `password` | `string` | **Required**.  |

#### Signin(Get Token)

```http
  POST /auth/signin
  Body 
  {
	"userName":"test9",
	"password":"te213123"
  }
```
| Parametre | Tip     | Açıklama                |
| :-------- | :------- | :------------------------- |
| `userName` | `string` | **Required**.  |
| `password` | `string` | **Required**.  |

Response
```javascript  
{
    "result": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3Q0IiwiaWF0IjoxNjUyNzAxMDIxLCJleHAiOjE2NTI3MDQ2MjF9.pKCCEb4J7hlP-VSzX8YKmo-FZiOyh7fEvlH9d6I72MM"
    },
    "success": true
}
```
```http
In order to make request successfully, you should add Authorization too all reqests below parameter to header like this;

Authorization : Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3Q0IiwiaWF0IjoxNjUyNzAxMDIxLCJleHAiOjE2NTI3MDQ2MjF9.pKCCEb4J7hlP-VSzX8YKmo-FZiOyh7fEvlH9d6I72MM
```

#### Get/Search Posts
```http
  /api/posts?limit={limit}&offset={offset}&[res.field-name: response.field_value]
```

| Parametre | Tip     | Açıklama                       |
| :-------- | :------- | :-------------------------------- |
| `limit`      | `string` | Default=100.|
| `offset`      | `string` | Default=0.|

**You can also set other parameter to filter response. 

#### Get Post By Reddit

```http
  /api/posts/{reddit}
```

| Parametre | Tip     | Açıklama                       |
| :-------- | :------- | :-------------------------------- |
| `reddit`      | `string` | **Required**, Redditname|

#### Get Post By Reddit

```http
  /api/post/{id}
```

| Parametre | Tip     | Açıklama                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**, post id |


#### Delete Post By Id

```http 
  HTTPDELETE /api/post/{id}
```

| Parametre | Tip     | Açıklama                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**, post id |



#### Get Posts

```http
  /api/users?limit={limit}&offset={offset}&[res.field-name: response.field_value]
```

| Parametre | Tip     | Açıklama                       |
| :-------- | :------- | :-------------------------------- |
| `limit`      | `string` | Default=100.|
| `offset`      | `string` | Default=0.|

**You can also set other parameter to filter response. 

```http
Example:
/api/users?limit=100&created=1651224247&allow_images=true
```

#### Get Reddits

```http
  /api/reddits?limit={limit}&offset={offset}&displayName={name}
```

| Parametre | Tip     | Açıklama                       |
| :-------- | :------- | :-------------------------------- |
| `limit`      | `string` | Default=100.|
| `offset`      | `string` | Default=0.|
| `offset`      | `string` | Subreddit name|
