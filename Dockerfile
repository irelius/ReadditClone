FROM python:3.9.18-alpine3.18

WORKDIR /var/www

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
RUN pip install --upgrade pip

ARG FLASK_APP=app
ARG FLASK_ENV=production
ARG FLASK_DEBUG=true

ENV SCHEMA=${SCHEMA}
ENV SECRET_KEY=${SECRET_KEY}
ENV DATABASE_URL=${DATABASE_URL}
ENV S3_BUCKET=${S3_BUCKET}
ENV S3_KEY=${S3_KEY}
ENV S3_SECRET=${S3_SECRET}

COPY . . 

RUN flask db upgrade
RUN flask seed all

CMD ["gunicorn", "app:app"]