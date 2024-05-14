- <<Data>>は freezeClass

```mermaid
---
title: User Model
---
classDiagram
    class UserError {
        <<Enum>>
        ERROR
        INVALID_INPUT_TYPES
    }

    class User {
        <<Data>>
        +id int
        +name string
        +birthday date

        +getAge() int
    }

  	class UserService {
        <<Service>>
        +url readOnly URL
        -users [User]

        +init(url:URL)
        +fetch() async throws -> bool
        +getUserByIndex(index: int) User?
        +getUserById(id: int) User?
    }

```
