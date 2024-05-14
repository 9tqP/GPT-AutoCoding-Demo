'use strict';

// Enum
const UserError = Object.freeze({
  ERROR: "ERROR",
  INVALID_INPUT_TYPES: "INVALID_INPUT_TYPES",
});

// DataClass
class User {
  constructor(id, name, birthday) {
    this.id = id;
    this.name = name;
    this.birthday = new Date(birthday);
  }

  getAge() {
    const today = new Date();
    const birthDate = new Date(this.birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}

// ServiceClass
class UserService {
  #users;

  constructor(url) {
    if (typeof url !== "string") {
      throw new Error(UserError.INVALID_INPUT_TYPES);
    }

    Object.defineProperty(this, "url", { value: url, writable: false });
    this.#users = [];
  }

  async fetch() {
    let jsonData;
    try {
      const response = await fetch(this.url);
      jsonData = await response.json();
    } catch (error) {
      throw new Error(UserError.ERROR);
    }

    if (!Array.isArray(jsonData)) {
      throw new Error(UserError.ERROR);
    }

    this.#users = this.#decode(jsonData);

    return true;
  }

  #decode(jsonData) {
    return jsonData.map((user) =>
      this.#createUser(user.id, user.name, user.birthday)
    );
  }

  #createUser(id, name, birthday) {
    if (
      typeof id !== "number" ||
      typeof name !== "string" ||
      typeof birthday !== "string"
    ) {
      throw new Error(UserError.INVALID_INPUT_TYPES);
    }

    const birthdayDate = new Date(birthday);
    if (isNaN(birthdayDate.getTime())) {
      throw new Error(UserError.INVALID_INPUT_TYPES);
    }
    return Object.freeze(new User(id, name, birthdayDate));
  }

  getUserByIndex(index) {
    if (index < 0 || index >= this.#users.length) {
      return null;
    }
    return this.#users[index];
  }

  getUserById(id) {
    return this.#users.find(user => user.id === id) || null;
  }
}

// ----------------------------------------

const api_url_001 = "http://localhost:4010/users";
const api_url_002 = "http://localhost:4010/";

async function main() {
  console.log("--- test001 ---");

  const usersService1 = new UserService(api_url_001);
  console.log(`url: ${usersService1.url}`);
  try {
    await usersService1.fetch();
    console.log(`private var: ${usersService1.users}`) // undefined
    let user = usersService1.getUserByIndex(0);
    console.log(`user: ${JSON.stringify(user)}`);
    console.log(`age: ${user.getAge()}`);
    user = usersService1.getUserById(2);
    //user.id = 100;
    //console.log(`id: ${user.id}`);
    console.log(`user: ${JSON.stringify(user)}`);
    console.log(`age: ${user.getAge()}`);
  } catch (error) {
    console.error("error", error);
  }

  console.log("--- test002 ---");

  const usersService2 = new UserService(api_url_002);
  console.log(`url: ${usersService2.url}`);

  // Error
  try {
    await usersService2.fetch();
  } catch (error) {
    console.error("error", error);
  }
}

main();
