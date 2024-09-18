# SPOTIFY ETL TASK

## ETL application

This application is a Spotify ETL tool that validates, transforms, and filters track and artist data from CSV files.
It securely stores processed data in AWS S3 and loads it into a PostgreSQL database, providing an efficient way to manage large music datasets.

## ETL Process Flow

1. **Validate CSV Files**

   - Validate the CSV files to ensure data integrity.

2. **Create Join Table**

   - Use the validated tracks data to create a join table.

3. **Transform CSV**

   - Transform the tracks CSV file for further processing.

4. **Filter CSV**

   - Filter the exploded join table and artist data.
   - Refine the dataset by removing unnecessary or irrelevant records.

5. **Upload to S3**

   - Upload the transformed and filtered data to Amazon S3.
   - Ensure the data is stored securely for later retrieval.

6. **Load to Database from S3**
   - Load the data from the S3 bucket into the database.
   - This completes the ETL process, making the data available for use.

## Installation

Clone the repository and install dependencies:

```bash
git https://github.com/Daliusj/ts-etl-task.git
cd ts-etl-task/
npm install

```

## Configuration

Application requires several environment variables for configuration. Create a `.env` file in the root directory:

```env
NODE_ENV=development
S3_BUCKET_NAME=spotify-etl-task
AWS_REGION=eu-central-1
DATABASE_URL=postgresql://etltask:etltask@localhost:5432/etltask-db
TEST_DATABASE=postgresql://etltask:etltask@localhost:5432/etltask-test-db
INPUT_FILE_DIR=/input/
OUTPUT_FILE_DIR=/output/
TRACKS_FILENAME=tracks.csv
ARTISTS_FILENAME=artists.csv
VALIDATED_FILE_PREFIX=valid
TRANSFORMED_FILE_PREFIX=trf
EXPLOADED_FILE_PREFIX=xpl
FILTERED_FILE_PREFIX=fltr

```

## Database Migrations

To manage database migrations run migration command:

```bash
npm run migrate:latest
```

### Running ETL process

Add raw tracks.csv and artists.csv files to input directory

Run command:

```bash
npm run process
```

## Running Tests

To start docker container with postgres database run command:

```bash
npm run testdb:up
```

To run tests command:

```bash
npm run test
```

Stop database docker container with command:

```bash
npm run testdb:down
```

## CI Pipeline

This project uses GitHub Actions to automate the Continuous Integration (CI) processes. The pipeline is triggered on every push to the repository and includes the following steps:

- **Testing:** The pipeline runs linters, type checking, and all unit tests to ensure code quality and functionality.

## Project Structure

- `/src`: Main source code directory.
- `/database`: Database configuration and migrations.
- `/schemas`: Zod schemas and TypeScript types.
- `/repository`: Database interaction logic.
- `/services`: ETL logic.
- `/utils`: Utility functions.
