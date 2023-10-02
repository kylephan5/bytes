FROM python:3.9-alpine

#RUN apk --no-cache add pkgconfig mariadb-connector-c-dev
RUN apk add --no-cache musl-dev gcc
RUN apk add --no-cache mysql-dev

ENV PYTHONUNBUFFERED 1
WORKDIR /bytes_api
COPY requirements.txt requirements.txt
RUN rm -rf build/
RUN rm -rf __pycache__/
RUN pip3 install -r requirements.txt
COPY . .