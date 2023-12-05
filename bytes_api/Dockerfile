FROM python:3.10

ENV PYTHONUNBUFFERED 1
WORKDIR /bytes_api
COPY requirements.txt requirements.txt
RUN rm -rf build/
RUN rm -rf __pycache__/
RUN pip3 install -r requirements.txt
COPY . .