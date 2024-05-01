# ERD

## ERD of `main database`

> `main database` means the relational database which is responsible for storing and supporting application's most feature. It is based on `mysql` and `cloudSQL`.

### simplified ERD

```mermaid
erDiagram
   	Group ||--o{ User : "givers"
    Group ||--|| User : "recipient"
    Group ||--o{ VrResource : "vrResources"
    Group ||--o{ VrVideo : "vrVideos"
    Group ||--o{ Badge : "badges"
    VrVideo ||--|| VrResource : "scene"
    VrVideo ||--o{ VrResource : "avatars"

    User {
      string id PK "유저 구분 아이디"
      string email
      string name
      string role
      boolean isEnrolled "최초 정보 등록 여부"
      string refreshToken
    }

    Group {
      string id PK "그룹 아이디"
    }

    VrResource {
      string id PK "VR 리소스 아이디"
      string title "VR 리소스 제목"
      string filePath "VR 리소스 위치"
      string type "타입"
	  bool isSample "샘플 여부"
    }

    VrVideo {
      string id PK "VR 비디오 아이디"
      string title "VR 비디오 제목"
	  bool isSample "샘플 여부"
    }

    Badge {
      int id PK "뱃지 아이디"
      string type "뱃지 종류"
    }
```

- This ERD is simplified, You can read in the diagram on focusing the `group` entity.

  - e.g.: The group has vrResources, badges, etc.

- Sample VR resources and videos can be used from all users and groups.
  - If `isSample` field is `true`, then it doesn't have foreign for `group` entity.
