from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from typing import List, Optional
import httpx

# Enum Class
class UserError(Enum):
    ERROR = "ERROR"
    INVALID_INPUT_TYPES = "INVALID_INPUT_TYPES"

# Custom Exception Class
class CustomException(Exception):
    def __init__(self, error: UserError, message: str = ""):
        self.error = error
        self.message = message
        super().__init__(f"{error.value}: {message}")

# DataClass
@dataclass(frozen=True)
class User:
    id: int
    name: str
    birthday: datetime

    def get_age(self) -> int:
        return int((datetime.now() - self.birthday).days / 365.25)

# ServiceClass
class UserService:
    _url: str
    _users: List[User] = []

    @property
    def url(self) -> str:
        return self._url

    def __init__(self, url: str):
        self._url = url

    async def fetch(self) -> bool:
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(self._url)
                response.raise_for_status()
                users_data = response.json()
                self._users = self._decode(users_data=users_data)
                return True
            except Exception as e:
                raise CustomException(UserError.ERROR, str(e)) from e

    def _decode(self, users_data: List[dict]) -> List[User]:
        _list = []
        for user_data in users_data:
            try:
                id = user_data['id']
                name = user_data['name']
                birthday = user_data['birthday']
                if not (isinstance(id, int) and isinstance(name, str) and isinstance(birthday, str)):
                    raise CustomException(UserError.INVALID_INPUT_TYPES)
                birthday = datetime.strptime(birthday, "%Y-%m-%d")
                _list.append(User(id=id, name=name, birthday=birthday))
            except KeyError as e:
                raise CustomException(UserError.INVALID_INPUT_TYPES, f"Missing key: {e}") from e
        return _list

    def get_user_by_index(self, index: int) -> Optional[User]:
        try:
            return self._users[index]
        except IndexError:
            return None

    def get_user_by_id(self, id: int) -> Optional[User]:
        for user in self._users:
            if user.id == id:
                return user
        return None


# ------------------------------------


import asyncio

api_url_001 = "http://localhost:4010/users"
api_url_002 = "http://localhost:4010/"

async def main():

    print("--- test001 ---")

    users = UserService(api_url_001)
    print(f"url: {users.url}")
    try:
        await users.fetch()
        user = users.get_user_by_index(0)
        print(f"user: {user}")
        print(f"age: {user.get_age()}")
        user = users.get_user_by_id(2)
        #user.id = 100
        #print(f"id: {user.id}")
        print(f"user: {user}")
        print(f"age: {user.get_age()}")
    except CustomException as error:
        print("error", error)

    print("--- test002 ---")

    users = UserService(api_url_002)
    print(f"url: {users.url}")
    try:
        await users.fetch()
    except CustomException as error:
        print("error", error)

asyncio.run(main())


