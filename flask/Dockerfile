FROM python:3.11.7-slim-bullseye

# Set the working directory
WORKDIR /usr/src/app

# Install pipenv
RUN pip install pipenv

# Copy the Pipfile and Pipfile.lock into the container
COPY Pipfile Pipfile.lock ./

# Install the dependencies in the Pipfile.lock
RUN pipenv install --deploy --ignore-pipfile

# Copy the rest of your application files into the container
COPY . .

# Your application will listen on port 8080
EXPOSE 8080

# The command to run your application
CMD ["pipenv", "run", "python", "main.py"]

