# 01 - Binding error

```js
  async getUsers(req: Request, res: Response) {
    const users = await this.usersService.getUsers();

    return res.json({
      status: "success",
      data: users,
      message: "Users retrieved successfully",
    });
  }
```

Because of how this works in functions where this keyword refers to the function, the solution was to
A:  Bind the functions at top-level of the application:
```js
    export class UsersController {
        private readonly usersService: UsersService;

        constructor() {
            this.usersService = new UsersService();
            
            // Bind methods so 'this' is correct when Express calls them
            this.getUsers = this.getUsers.bind(this);
            this.getUserById = this.getUserById.bind(this);
        }
        // ...rest of code
    }
```

B: Call the functions as Arrow functions directly (Easiest) but not so beautiful
```js
  getUsers = (req: Request, res: Response) => {
    const users = await this.usersService.getUsers();

    return res.json({
      status: "success",
      data: users,
      message: "Users retrieved successfully",
    });
  }
```

C: Change the controller from a class to fucntions
