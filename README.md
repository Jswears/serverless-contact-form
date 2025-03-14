# Contact Form Lambda

This project is an AWS Lambda function designed to handle contact form submissions. It validates the input, sends an email using AWS SES, and returns appropriate responses.

## Project Structure

- **src/**: Contains the source code for the Lambda function.
  - **contactForm/**: Main handler for the Lambda function.
  - **utils/**: Utility functions and validators.
  - **types/**: Type definitions.
- **dist/**: Output directory for the built files.
- **node_modules/**: Directory for installed npm packages.

## Setup

### Prerequisites

- Node.js (v14 or higher)
- AWS CLI configured with appropriate permissions
- AWS SES setup with verified email addresses

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/Jswears/serverless-contact-form.git
   cd contact-form-lambda
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

### Configuration

Create a `.env` file in the root directory and add the following environment variables or add them to your Lambda function configuration:

```
AWS_REGION=your-aws-region
CORS_ORIGIN=https://www.yourdomain.com
```

### Build

To build the project, run:

```sh
npm run build
```

This will bundle the TypeScript files using esbuild and create a zip file in the `dist/` directory.

### Deployment

Deploy the `dist/index.zip` file to AWS Lambda using the AWS CLI or AWS Management Console.

### Usage

The Lambda function expects a POST request with the following JSON body:

```json
{
  "name": "Your Name",
  "email": "your.email@example.com",
  "message": "Your message here"
}
```

### Testing

Currently, there are no tests specified. You can add your tests in the `src/tests/` directory and update the `package.json` scripts accordingly.

## License

This project is licensed under the ISC License.
