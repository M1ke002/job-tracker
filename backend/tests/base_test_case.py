import unittest
from app import create_app, db

class BaseTestCase(unittest.TestCase):
    #runs before the first test
    def create_app(self):
        app = create_app(config_name="test")
        return app
    
    #runs before each test
    def setUp(self):
        self.app = self.create_app()
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()

    #runs after each test
    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()