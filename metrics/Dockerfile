FROM python:3.13-slim

WORKDIR /src/app

COPY ./requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENTRYPOINT ["python3", "main.py"]