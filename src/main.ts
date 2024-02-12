import { v4 as uuidv4, validate as uuidValidate } from 'uuid';
import http from 'http';
import 'dotenv/config';
import cluster from 'cluster';
import os from 'os';

interface UserDTO {
  username: string;
  age: number;
  hobbies: string[];
}

interface User extends UserDTO {
  id: string;
}

const port: number = Number(process.env.PORT) || 3000;

let users: User[] = [];

function getRequestBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      let body: string = '';

      req.on('data', (chunk) => {
        body += chunk.toString();
      });

      req.on('end', () => {
        resolve(body);
      });
    } catch (error) {
      reject(error);
    }
  });
}

function getUsers(): Promise<User[]> {
  return Promise.resolve(users);
}

async function getUserById(id: string): Promise<User | null> {
  const users: User[] = await getUsers();
  const user: User | undefined = users.find(
    (user: User): boolean => user.id === id,
  );
  if (user) {
    return Promise.resolve(user);
  } else {
    return Promise.resolve(null);
  }
}

async function createUser(req: http.IncomingMessage): Promise<User | null> {
  const body: string = await getRequestBody(req);
  const userDTO: UserDTO = JSON.parse(body);
  const isUserNameCorrect: boolean =
    userDTO.username !== undefined && typeof userDTO.username === 'string';
  const isAgeCorrect: boolean =
    userDTO.age !== undefined && typeof userDTO.age === 'number';
  const isHobbiesCorrect: boolean =
    userDTO.hobbies !== undefined && userDTO.hobbies instanceof Array;
  if (isUserNameCorrect && isAgeCorrect && isHobbiesCorrect) {
    const newUser: User = {
      id: uuidv4(),
      username: userDTO.username,
      age: userDTO.age,
      hobbies: userDTO.hobbies,
    };
    users = [...users, newUser];
    return newUser;
  } else {
    return null;
  }
}

async function updateUser(
  req: http.IncomingMessage,
  id: string,
): Promise<User | null> {
  const allUsers: User[] = await getUsers();
  const user: User | undefined = allUsers.find(
    (user: User): boolean => user.id === id,
  );
  if (user) {
    const body: string = await getRequestBody(req);
    const userDTO: Partial<User> = JSON.parse(body);
    const isNameCorrect: boolean =
      userDTO.username !== undefined && typeof userDTO.username === 'string';
    const isAgeCorrect: boolean =
      userDTO.age !== undefined && typeof userDTO.age === 'number';
    const isHobbiesCorrect: boolean =
      userDTO.hobbies !== undefined && userDTO.hobbies instanceof Array;
    const updatedUser: User = {
      id: user.id,
      age: isAgeCorrect && userDTO.age ? userDTO.age : user.age,
      username:
        isNameCorrect && userDTO.username ? userDTO.username : user.username,
      hobbies:
        isHobbiesCorrect && userDTO.hobbies ? userDTO.hobbies : user.hobbies,
    };
    users = [...users.filter((user) => user.id !== id), updatedUser];
    return Promise.resolve(updatedUser);
  } else {
    return Promise.resolve(null);
  }
}

async function deleteUser(id: string): Promise<boolean> {
  const allUsers: User[] = await getUsers();
  const user: User | undefined = allUsers.find(
    (user: User): boolean => user.id === id,
  );
  if (user) {
    users = [...users.filter((user: User): boolean => user.id !== id)];
    return true;
  } else {
    return false;
  }
}

export const server: http.Server = http.createServer(async function (
  req: http.IncomingMessage,
  res: http.ServerResponse<http.IncomingMessage> & {
    req: http.IncomingMessage;
  },
) {
  const hasIdInUrl: boolean = Boolean(req.url!.match(/\/api\/users\/\w+/));

  if (req.url === '/api/users' && req.method === 'GET') {
    try {
      const allUsers: User[] = await getUsers();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(allUsers));
    } catch (error: unknown) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: `${error}` }));
    }
  } else if (hasIdInUrl && req.method === 'GET') {
    try {
      const id: string = req.url!.split('/')[3] || '';
      const isIdValid: boolean = uuidValidate(id);
      const user: User | null = await getUserById(id);
      if (isIdValid && user !== null) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
      } else if (!isIdValid) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'UserId is invalid (not uuid)' }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            message: `Record with id === ${id} doesn't exist`,
          }),
        );
      }
    } catch (error: unknown) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: `${error}` }));
    }
  } else if (req.url === '/api/users' && req.method === 'POST') {
    try {
      const newUser = await createUser(req);
      if (newUser === null) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            message: 'Request body does not contain required fields',
          }),
        );
      } else {
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newUser));
      }
    } catch (error: unknown) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: `${error}` }));
    }
  } else if (hasIdInUrl && req.method === 'PUT') {
    try {
      const id: string = req.url!.split('/')[3] || '';
      const isIdValid: boolean = uuidValidate(id);
      const user: User | null = await updateUser(req, id);
      if (isIdValid && user !== null) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
      } else if (!isIdValid) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'UserId is invalid (not uuid)' }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            message: `Record with id === ${id} doesn't exist`,
          }),
        );
      }
    } catch (error: unknown) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: `${error}` }));
    }
  } else if (hasIdInUrl && req.method === 'DELETE') {
    try {
      const id: string = req.url!.split('/')[3] || '';
      const isIdValid: boolean = uuidValidate(id);
      const isUserDeleted: boolean = await deleteUser(id);
      if (isIdValid && isUserDeleted) {
        res.writeHead(204, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: `User with id:${id} is deleted` }));
      } else if (!isIdValid) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'UserId is invalid (not uuid)' }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            message: `Record with id === ${id} doesn't exist`,
          }),
        );
      }
    } catch (error: unknown) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: `${error}` }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Route not found' }));
  }
});

if (cluster.isPrimary) {
  const numCPUs = os.availableParallelism();
  console.log(`Primary ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork({ PORT: Number(port) + i });
  }

  cluster.on('exit', (worker) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  server.listen(port, () =>
    console.log(`Server is running on http://localhost:${port}`),
  );
}
