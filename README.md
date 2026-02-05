Simple app for making To-Do lists. Tests are done using Vitest and Playwright.

1. Install dependencies:
```
npm install
```
2. Unit tests:
```
npm run test:unit
```
3. End to end tests:
```
npm run test:e2e
```
4. Run the app:
```
npm run dev
```

To run on AWS:

1. Install AWS library
```
npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
```
2. Run the app:
```
npx http-server
```
