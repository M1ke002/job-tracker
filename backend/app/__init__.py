from flask import Flask
from flask_cors import CORS
from .config import config_by_name
from flask_migrate import Migrate

# import models
from .model import db
from .model import User
from .model import ApplicationStage
from .model import SavedJob
from .model import JobListing
from .model import Task
from .model import Contact
from .model import Document
from .model import DocumentType
from .model import ScrapedSite
from .model import ScrapedSiteSettings
from .model import Notification


def register_blueprints(app: Flask):
    # import blueprints
    from .controller import job_listing_routes
    from .controller import saved_job_routes
    from .controller import scraped_site_routes
    from .controller import scraped_site_settings_routes
    from .controller import auth_routes
    from .controller import user_routes
    from .controller import application_stage_routes
    from .controller import contact_routes
    from .controller import task_routes
    from .controller import document_routes
    from .controller import document_type_routes
    from .controller import notification_routes

    app.register_blueprint(job_listing_routes, url_prefix="/api/job-listings")
    app.register_blueprint(saved_job_routes, url_prefix="/api/saved-jobs")
    app.register_blueprint(scraped_site_routes, url_prefix="/api/scraped-sites")
    app.register_blueprint(scraped_site_settings_routes, url_prefix="/api/scraped-site-settings")
    app.register_blueprint(auth_routes, url_prefix="/api/auth")
    app.register_blueprint(user_routes, url_prefix="/api/users")
    app.register_blueprint(application_stage_routes, url_prefix="/api/application-stages")
    app.register_blueprint(contact_routes, url_prefix="/api/contacts")
    app.register_blueprint(task_routes, url_prefix="/api/tasks")
    app.register_blueprint(document_routes, url_prefix="/api/documents")
    app.register_blueprint(document_type_routes, url_prefix="/api/document-types")
    app.register_blueprint(notification_routes, url_prefix="/api/notifications")


def init_extensions(app):
    db.init_app(app)
    migrate = Migrate(app, db)


# use application factory pattern
def create_app(config_name):
    app = Flask(__name__)

    # enable CORS because we need to access this API from a different server localhost:3000 to localhost:5000
    # if same url and port, CORS is not needed
    CORS(app, origins=["http://localhost:5173"], supports_credentials=True)
    app.config.from_object(config_by_name[config_name])

    # register blueprints
    register_blueprints(app)

    # initialize extensions
    init_extensions(app)

    # initialize login manager
    # login = LoginManager(app)

    return app
