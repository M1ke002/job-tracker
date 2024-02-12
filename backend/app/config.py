import os
from dotenv import load_dotenv

load_dotenv()

basedir = os.path.abspath(os.path.dirname(__file__))

database_config = {
    "username": os.getenv("DB_USERNAME"),
    "password": os.getenv("DB_PASSWORD"),
    "host": os.getenv("DB_HOST"),
    "port": os.getenv("DB_PORT"),
    "database": os.getenv("DB_NAME"),
}


def create_database_url(db_type: str = "mysql"):
    username = database_config["username"]
    password = database_config["password"]
    host = database_config["host"]
    port = database_config["port"]
    database = database_config["database"]

    if db_type == "postgres":
        return f"postgresql+psycopg2://{username}:{password}@{host}:{port}/{database}"
    else:
        return f"mysql+pymysql://{username}:{password}@{host}:{port}/{database}"


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "my_precious_secret_key")
    SQLALCHEMY_DATABASE_URI = create_database_url(db_type="mysql")
    DEBUG = False


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class TestingConfig(Config):
    DEBUG = True
    TESTING = True
    # use in-memory sqlite for testing
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(basedir, 'test.db')}"
    PRESERVE_CONTEXT_ON_EXCEPTION = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class ProductionConfig(Config):
    DEBUG = False


config_by_name = dict(dev=DevelopmentConfig, test=TestingConfig, prod=ProductionConfig)

key = Config.SECRET_KEY
