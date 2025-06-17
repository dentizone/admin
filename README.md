# Admin Dashboard

A modern admin dashboard built with Angular and Tailwind CSS.

## Project Structure

```
src/
├── app/
│   ├── core/                 # Singleton services and features
│   │   ├── services/        # Global services
│   │   ├── guards/          # Route guards
│   │   ├── interceptors/    # HTTP interceptors
│   │   └── models/          # Global interfaces and types
│   │
│   ├── shared/              # Shared features
│   │   ├── components/      # Reusable components
│   │   ├── directives/      # Custom directives
│   │   └── pipes/           # Custom pipes
│   │
│   ├── features/            # Feature modules
│   │   ├── dashboard/       # Dashboard feature
│   │   ├── auth/           # Authentication feature
│   │   ├── users/          # User management
│   │   └── settings/       # App settings
│   │
│   └── layouts/            # Application layouts
│       ├── admin/          # Admin layout
│       └── auth/           # Auth layout
│
└── assets/                 # Static assets
    ├── images/            # Images
    ├── icons/            # Icons
    └── styles/           # Global styles

```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
ng serve
```

3. Build for production:
```bash
ng build
```

## Technologies Used

- Angular 17
- Tailwind CSS
- TypeScript

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
