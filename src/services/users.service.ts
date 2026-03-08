export class UsersService {
  constructor() {}

  async getUsers() {
    return [
      {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        age: 20,
      },
    ];
  }

  async getUserById(id: number) {
    return {
      id,
      name: "John Doe",
      email: "john.doe@example.com",
      age: 20,
    };
  }
}
