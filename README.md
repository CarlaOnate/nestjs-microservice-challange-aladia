# Tech Challenge Documentation

## Architecture Design

The project follows a microservices architecture pattern with a clear separation of concerns. Below is the folder structure that organizes the codebase:

```
project-root/
│
├── apps/
│   ├── authentication/              # Authentication Microservice
│   │   ├── auth/                    # Auth module
│   │   ├── users/                   # Users module
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   └── .env
│   │
│   └── gateway/                     # API Gateway
│       ├── src/
│       │   ├── authentication/      # Authentication module
│       │   │   ├── dto/
│       │   │   ├── strategy/        # Auth strategies
│       │   │   └── users/
│       │   ├── gateway.module.ts
│       │   └── main.ts
│       └── .env
│
├── common/                          # Shared resources
│   ├── constants/
│   ├── dto/                         # Shared DTOs between gateway and microservice
│   └── definitions.ts               # TypeScript definitions
│
├── config/                          # Configuration files
│
└── core/                            # Core utilities
    ├── decorators/
    ├── guards/
    ├── interceptors/
    └── pipes/
```

### Architecture Overview

The project implements a **microservices architecture** where each microservice has its own database. For this exercise, a single microservice is demonstrated with one database connection. The repository is structured as a **monorepo**, storing all microservice applications together with common folders that all apps can access.
This specific architecture has a single point of failure which is the gateway. Meaning if the gateway node fails there is no other way to access the microservices.

### Key Architectural Decisions

#### DTOs

There are shared DTOs between gateway and microservice but also private DTOs for the gateway. This was done to have loosely coupled connection between the gateway and the microservice. Meaning that changing the DTO for the microservice doesn't affect the input the Gateway expects but does require the gateway to send the correct data to the service. 
The private DTOs are used for the RestAPI bodies that are sent with HTTP requests. 
The common DTOs are used to declare the data the gateway needs to send to the microservice and are used to validate input in the microservice. 

#### Environment variables

In this project each application has its own .env file. This decision was done to have a clear separation of environment variables between applications. 
The prupose is to have .env files located where they're used so its easer to debug and to understand which variables are for which application.
This could have been done by having separate .env files stored in the config folder. 

#### Gateway Modules

Insid the gateway application, there is one module for the microservice. However that specific microservice has two modules, one to handle authentication operations and other for user management. In the initial architecture the autentication module in gateway had another internal module for user management. The microservice declaration is done in the authentication.module and it imports the UsersModule, however the users module also needs access to the client to send requests to the authentication microservice. This created a circular dependency which because of time contraints I could not solve. To fix this I removed the user module but kept different controllers for different business domains. 

#### Applications

The system consists of two applications that communicate via TCP:

**1. Gateway (`apps/gateway/`)**
- This is the **entry point** RESTful API that redirects requests to the microservices depending on the URI received
- Implements only the **Controller → Service** architecture (no Repository layer, as there is no direct connection to a database)
- Routes all requests to the appropriate microservice based on URI patterns

**2. Authentication Microservice (`apps/authentication/`)**
- This service is only called when the URI prefix is `auth`
- Implements the complete **Controller → Service → Repository** architecture
- The Repository is connected to a users database, which the Users module handles
- Organized into domain-specific modules:
  - **Auth Module**: Handles authentication operations
  - **Users Module**: Manages user operations and database interactions

---

## Detailed Description

### Gateway

#### Gateway module

In the gateway module there is a default getHello route for debugging purposes during development, but none of the main functionality is stored there. 
It creates an application that has different controllers for different microservices. 
This module handles:
- The import of the .env file for the gateway application
- Imports the authentication module to be able to route requests to the gateway authentication controller
- It also applies the jwt guard with the jwt strategy to validate JWT received in the Bearer Token.

#### Authentication module

The client for the microservice is declared in this module, as well as the JWTModule with its secret.

```
    ClientsModule.registerAsync([{
      name: AUTH_CLIENT,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: Transport.TCP, <--- TCP transport layer used to communicate with microservice
        options: {
          port: configService.get<number>('AUTH_MICROSERVICE_PORT', 3001),
        },
      }),
      inject: [ConfigService],
    }])
```

In the authentication module there are two controllers:
- AuthenticationController
  - POST auth/register (Public)
  - POST auth/login (Public)
  - GET auth/heartbeat (Private)
- UsersController
  - GET auth/users/ (findAll users) (Private)
In this module the requests go through Controller => Service => TCP. 

**JWT Implementation**

There are two strategies implemented, the localStrategy and the JWTStrategy.
There are two possible login flows:
- User registers => logged in => secret_token returned
- User logs in => localStrategy => validateUser => login => secret_token returned.

The JWTStratety applies when making requests to Private endpoints.
- API call without header to private endpoint => JWTGuard => 401 Access Denied
- API call with header => JWTGuard => Can access enpoint

There are two custom guards that handle authentication.
The **localStrategy** is used to validate an user using the { email, password } body received in the login endpoint.
When this strategy is used, the validation responsibility is passed on to the microservice auth, where the password is compared. If the password is correct then the user is returned.
```
LocalStrategy => validateUser (Auth Service in Gateway) => validateUser (Auth Controller Microservice) => validateUser (Auth Service Microservice) => findOneByEmailForAuth (User Sercice Microservice) => User repository returns user with password
```

The **jwtStrategy** validates the token sent by the user.

**Validation**

Input validation is done using class-validator. The DTOs have decorators to declare the validation for each key in the class.
The validation pipe is added to the main.ts file to apply to all globally. 
```
// main.ts

app.useGlobalPipes(new ValidationPipe({ transform: true }));

// register-user.dto.ts
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 18)
  password: string;
}

```

If the input received in the controller does pass the validation then an BAD REQUEST error will be thrown.
Example validation:
```
// POST auth/register BDOY
{
    "firstName": "",
    "lastName": "Manuel",
    "email": "cocomanuel4@gmail.com",
    "password": "12345678"
}
// Response
{
    "message": [
        "firstName should not be empty"
    ],
    "error": "Bad Request",
    "statusCode": 400
}
```

**Response Transform**

class-transform was used to modify all response to have the same format. This was used using interceptors. 
The class *TransformGatewayInterceptor* modified the response before it leaves and adds some extra fields. The biggest one is to have the actual data of the request grouped into data and adds some extra fields like timestamp of the request.

```
// main.ts
app.useGlobalInterceptors(new TransformGatewayInterceptor());

// Response from GET auth/users
{
    "success": true,
    "statusCode": 200,
    "message": "Request successful",
    "data": [
        {
            "_id": "69039f782d8a83a2ca00f9b4",
            "firstName": "Juanito",
            "lastName": "Panchito",
            "email": "juanito_panchito@gmail.com"
        }],
    "timestamp": "2025-10-30T17:25:12.729Z"
}
```

### Authentication 

The authentication microservice has two modules:
- auth module
- useres module

#### Auth module

This module has two messagePatterns:

```
export const AUTH_PATTERNS = {
  REGISTER: 'auth.register',
  VALIDATE_USER: 'auth.validate-user',
}
```

**Registration**

The messagePattern registration handles the hashing of the password and adds it to the registerUserDto. 
Then the userService is used to register the user to the DB. (Clear separation of concerns between modules). The hashing of the passwor is done using bycrypt. 

```
const password: string = registerUserDto.password;
const hashed_password: string = await bcrypt.hash(password, 10);
const user = {
  ...registerUserDto,
  password: hashed_password,
}
```

If the user is already register a BAD REQUEST Error is thrown. 

```
if (existingUser) throw new BadRequestException('Email already exists');
```

**Validate User**
The messagePattern validateUser receives the data from the gateway when the user is logging with its email and password. The validate user service function uses the user service to find the user by email and use bycrypt to compare the password. 

```
  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneByEmailForAuth(email);
    if (!user) throw new BadRequestException('User not found');

    const isMatch: boolean = bcrypt.compareSync(password, user.password);
    if (!isMatch) throw new BadRequestException('Password does not match');

    return user;
  }
```

#### Users module

This module has one messagePattern:
```
// Constant variable messagePatterns used both in gateway and microservices
export const USER_PATTERNS = {
  FIND_ALL: 'auth.users.findAll',
  FIND_ONE: 'auth.users.findOne' // Not mapped to a controller
}
```

**findAll** 
This messagePatterns retrieves all useres from the database, going through Service => Repository and then returning the list of users. 
In all queries except forAuth queries the userPassword is not serialized by mongoose. This is specified in the schema for sercurity reasons. 

**Repository**
The repository is created only in the users module, in here the connection to the MongoDB is created. The repository focuses only on calling the db, so its function names tend to match those of mongoose. All bussiness logic is done in the service. 


Using the user.entity as the Schema for the documents of the users collection. This project doesn't have docker files to create a container per application. Because of this the DB was created in the Mongo Cloud Atlas.
```
MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = `mongodb+srv://${configService.get('DB_USERNAME')}_db_user:${configService.get('DB_PASSWORD')}@nestjs-challenge.ora4ujs.mongodb.net/?appName=nestjs-challenge"`;
        return {
          uri: uri,
          dbName: configService.get('DB_NAME'),
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{
      name: User.name,
      schema: UserSchema
    }])
```

The schema has some validation to ensure data consistency in the DB. As well the password field is hidden by default to prevent the hashed password to be constantly used in the service. There is one specific service function that queries the user with the password and is only for user validation. 

```
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';

@Schema()
export class User {
  _id: string; // Key handled by mongoose

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false }) // Password should not show in query results
  password: string;

  @Prop({ default: Date.now() })
  createdDate: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
```

**Validation**
The validation is done using class-validator and the DTOs to throw exceptions if the data received doesn't match the DTO class. Global pipes are added in the main.ts file of the microservice to apply validation to all messagPatterns. 
Example validation:
```
//authentication/main.ts
app.useGlobalPipes(new ValidationPipe({  <-- use validation pipes for all messagePatterns
  transform: true,
  exceptionFactory: (errors) => new RpcException(errors) <-- RCPExceptions are thrown for microservices
}))

// apps/authentication/auth/authentication.controller.ts
@MessagePattern(AUTH_PATTERNS.REGISTER)
  register(@Payload() registerUserDto: RegisterUserDto) {
    return this.authenticationService.register(registerUserDto);
  }

import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

// common/dto/authentication/register-user.dto.ts
export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 18)
  password: string;
}

```
If the input doesn't match an error is thrown, however ErrorHandling in the gateway application is missing to show the client the proper error message. 
Because of time constraints this feature was not implemented. 

**Output Transformation**
For the output transformation, an interceptor was created to modify the response from the microservice to match a specific DTO. 
```
// authentication/main.ts
app.useGlobalInterceptors(new TransformUserInterceptor());

// core/interceptors/transform-user-interceptor.ts
@Injectable()
export class TransformUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        return plainToInstance(UserDto, data, {excludeExtraneousValues: true});
      })
    );
  }
}

// common/UserDto
import { Exclude, Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  _id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Exclude()
  password: string;   <-- second layer to prevent password to exit the microservice
}

```


## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

This challenge doesn't have tests at the moment. 
