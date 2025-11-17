FROM python:3.9.18-alpine3.18

WORKDIR /var/www

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
RUN pip install psycopg2-binary
RUN pip install --upgrade pip

ARG FLASK_APP=app
ARG FLASK_ENV=production

# Don't share secret key for security reasons
ARG SCHEMA
ENV SCHEMA=${SCHEMA}

# Don't share secret key for security reasons
ARG SECRET_KEY
ENV SECRET_KEY=${SECRET_KEY}

# Don't share secret key for security reasons
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# AWS3 keys. Don't share for security reasons
ARG S3_BUCKET
ENV S3_BUCKET=${S3_BUCKET}
ARG S3_KEY
ENV S3_KEY=${S3_KEY}
ARG S3_SECRET
ENV S3_SECRET=${S3_SECRET}

COPY . . 

# # ------------- Following two steps only necessary if you add "migrations" to the .dockerignore file ------------
# RUN flask db init
# RUN flask db migrate

RUN flask db upgrade
RUN flask seed all


CMD ["gunicorn", "app:app"]
# Alternatively: `CMD gunicorn app:app` should work