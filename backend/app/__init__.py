from flask import Flask
from flask_cors import CORS
from .config import config_by_name
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt

#import blueprints
from .controller import test_routes, job_listing_routes

#import models
from .model import db, user, ApplicationStage, SavedJob, JobListing, Task, Contact, Document, DocumentType, ScrapedSite, Notification

app = Flask(__name__)
app.config.from_object(config_by_name['dev'])

# enable CORS because we need to access this API from a different server localhost:3000 to localhost:5000
#if same url and port, CORS is not needed
CORS(app)

#register blueprints
app.register_blueprint(test_routes, url_prefix='/')
app.register_blueprint(job_listing_routes, url_prefix='/api/job-listing')

#initialize db
db.init_app(app)
migrate = Migrate(app, db)

flask_bcrypt = Bcrypt()
flask_bcrypt.init_app(app)



