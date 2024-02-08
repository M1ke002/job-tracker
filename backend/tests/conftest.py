import pytest
from app import create_app
from app import db

@pytest.fixture(scope='function')
def app():
    app = create_app(config_name="test")
    yield app

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

# @pytest.fixture
# def client(app):
#     return app.test_client()

# @pytest.fixture(autouse=True)
# def init_db(app):
#     db.create_all()
#     yield db
#     db.session.remove()
#     db.drop_all()

