import pytest
from unittest.mock import patch
from app import create_app
from app import db

@pytest.fixture(scope='function')
def app():
    app = create_app(config_name="test")
    return app

@pytest.fixture(scope='function')
def client(app):
    with app.test_client() as testclient:
        yield testclient

@pytest.fixture(scope='function')
def database(app):
    with app.app_context():
        db.create_all()
        yield db
        db.session.remove()
        db.drop_all()

