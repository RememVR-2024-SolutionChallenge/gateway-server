## 🔎 Overview

This server operates as a **`traditional application server`**, but also serves as a **`gateway server for driving separate AI engine`**. As a gateway server, it queues requests to the AI server, and stores request data and resources. And also as an application server, it runs a query on a database, reprocesses the information, and provides it, according to the user's request.

## 🤔 How To Run

```bash
$ git clone https://github.com/RememVR-2024-SolutionChallenge/gateway-server.git
$ cd gateway-server
$ npm install
$ npm run start:dev
```

Some private environmental variables are required to run this server. If you need to run our server, [contact us](mailto:wooguijung@korea.ac.kr).

- `.env` file is required.
- `gcp-credentials` are required for `cloud storage`, `firestore`, etc.

## 🛠 Architecture

![architecture](./docs/assets/architecture.jpg)

## ⚙️ Features

| Authentication                                                                                                                                                                                                                                                                                                                                                                                                                          | Group (care relaitonship)                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | VR resources                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| - By using Google's OAuth2.0 method, make easier to join for this service. <br/><br/> - By using JWT method, reduce the difficulty of implementing the server for the session DB. <br/><br/>- By using refresh token, increase user experience by eliminating the inconvenience of frequently signing in. <br/><br/> - By setting refresh token's valid number of uses to 1, take security issues such as the takeover of fresh tokens. | - When first signing up, set a care giver (or care recipient) and connect relationship to create a group. <br/><br/> - In order to handle security issues, the care giver must enter in 30 minutes the certificate sent to the care recipient's email to connect. <br/><br/> - VR resources or \*badges are managed on a per-group basis. <br/><br/> (\* Badges are expected to serve as an easy way to know the status of reminiscence therapy, and as a motivation to encourage therapy.) <br/> | - By using AI, users can convert video to VR resource. <br/><br/> - In the converting process, the load of AI server is enormous and takes a lot of time, so gateway server stores data to storage(Cloud Storage, Firestore) and triggers a message broker. <br/><br/> - After VR resource is generated in AI, data enters Firestore and Cloud Storage, and Cloud Functions automatically transfers data from Firestore to Cloud SQL (\*main DB). <br/><br/> - Sensitive files related to personal information was secured by utilizing a protect Cloud Storage bucket and signed URLs. |

## 🔧 Seperate small-scale logics

> These logics are represented by gray lines in the architecture diagram.

Thanks to two Cloud Functions functions, the logic of the gateway server was lightened, and the dependence on the AI server was reduced. To be precise, **it allowed the gateway server to not care about the AI server's state or task progress.**

### [AI task scheduler](https://github.com/RememberMe-2024-SolutionChallenge/AI-task-scheduler)

It is responsible for queuing requests to AI server. The dependency between AI server and gateway server was loosened by using push queue method and pull queue method together.

### [realtime-DB-synchronization](https://github.com/RememberMe-2024-SolutionChallenge/realtime-DB-synchronization)

It is responsible for synchronizing between Firestore and CloudSQL. When the AI server stores its result in Cloud Storage and Firestore, instant synchronization takes place from Firestore(sub DB) to CloudSQL(main DB).

## 🧑🏻‍💻 Other Developer Documentations

- **[📄 ERD](https://github.com/RememVR-2024-SolutionChallenge/gateway-server/blob/main/docs/develop/ERD.md)**
- **[📲 API Documentation](https://gateway-server-v2-n3wk2vhygq-uc.a.run.app/docs)**
