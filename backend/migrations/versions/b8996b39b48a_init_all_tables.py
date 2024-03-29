"""init all tables

Revision ID: b8996b39b48a
Revises:
Create Date: 2024-02-15 10:27:05.992958

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "b8996b39b48a"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "application_stages",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("stage_name", sa.String(length=150), nullable=False),
        sa.Column("position", sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "document_types",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("type_name", sa.String(length=150), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "notifications",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("message", sa.String(length=1000), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("is_read", sa.Boolean(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "scraped_site_settings",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("scrape_frequency", sa.Integer(), nullable=False),
        sa.Column("max_pages_to_scrape", sa.Integer(), nullable=False),
        sa.Column("is_notify_email", sa.Boolean(), nullable=False),
        sa.Column("is_notify_on_website", sa.Boolean(), nullable=False),
        sa.Column("search_keyword", sa.String(length=150), nullable=True),
        sa.Column("location", sa.String(length=150), nullable=True),
        sa.Column("job_type", sa.String(length=150), nullable=True),
        sa.Column("classification", sa.String(length=150), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("username", sa.String(length=60), nullable=False),
        sa.Column("email", sa.String(length=100), nullable=False),
        sa.Column("password", sa.String(length=200), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    with op.batch_alter_table("users", schema=None) as batch_op:
        batch_op.create_index(batch_op.f("ix_users_email"), ["email"], unique=True)
        batch_op.create_index(batch_op.f("ix_users_username"), ["username"], unique=True)

    op.create_table(
        "saved_jobs",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("stage_id", sa.Integer(), nullable=True),
        sa.Column("rejected_at_stage_id", sa.Integer(), nullable=True),
        sa.Column("job_title", sa.String(length=150), nullable=False),
        sa.Column("company_name", sa.String(length=150), nullable=False),
        sa.Column("location", sa.String(length=200), nullable=True),
        sa.Column("job_description", sa.String(length=6000), nullable=True),
        sa.Column("additional_info", sa.String(length=500), nullable=True),
        sa.Column("salary", sa.String(length=100), nullable=True),
        sa.Column("job_url", sa.String(length=500), nullable=False),
        sa.Column("job_date", sa.String(length=100), nullable=True),
        sa.Column("notes", sa.String(length=5000), nullable=True),
        sa.Column("position", sa.Integer(), nullable=True),
        sa.Column("is_favorite", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(
            ["rejected_at_stage_id"],
            ["application_stages.id"],
        ),
        sa.ForeignKeyConstraint(
            ["stage_id"],
            ["application_stages.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "scraped_sites",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("scraped_site_settings_id", sa.Integer(), nullable=False),
        sa.Column("website_name", sa.String(length=150), nullable=False),
        sa.Column("last_scrape_date", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(
            ["scraped_site_settings_id"],
            ["scraped_site_settings.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "contacts",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("job_id", sa.Integer(), nullable=False),
        sa.Column("person_name", sa.String(length=150), nullable=False),
        sa.Column("person_position", sa.String(length=150), nullable=True),
        sa.Column("person_linkedin", sa.String(length=250), nullable=True),
        sa.Column("person_email", sa.String(length=250), nullable=True),
        sa.Column("note", sa.String(length=1000), nullable=True),
        sa.ForeignKeyConstraint(
            ["job_id"],
            ["saved_jobs.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "documents",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("document_type_id", sa.Integer(), nullable=False),
        sa.Column("job_id", sa.Integer(), nullable=True),
        sa.Column("file_name", sa.String(length=150), nullable=False),
        sa.Column("file_url", sa.String(length=500), nullable=False),
        sa.Column("date_uploaded", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(
            ["document_type_id"],
            ["document_types.id"],
        ),
        sa.ForeignKeyConstraint(
            ["job_id"],
            ["saved_jobs.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "job_listings",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("scraped_site_id", sa.Integer(), nullable=False),
        sa.Column("job_title", sa.String(length=150), nullable=False),
        sa.Column("company_name", sa.String(length=150), nullable=False),
        sa.Column("location", sa.String(length=200), nullable=True),
        sa.Column("job_description", sa.String(length=1000), nullable=True),
        sa.Column("additional_info", sa.String(length=500), nullable=True),
        sa.Column("salary", sa.String(length=100), nullable=True),
        sa.Column("job_url", sa.String(length=500), nullable=False),
        sa.Column("job_date", sa.String(length=100), nullable=True),
        sa.Column("is_new", sa.Boolean(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(
            ["scraped_site_id"],
            ["scraped_sites.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "tasks",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("job_id", sa.Integer(), nullable=False),
        sa.Column("task_name", sa.String(length=150), nullable=False),
        sa.Column("due_date", sa.DateTime(timezone=True), nullable=True),
        sa.Column("is_completed", sa.Boolean(), nullable=False),
        sa.Column("is_reminder_enabled", sa.Boolean(), nullable=False),
        sa.Column("is_reminded", sa.Boolean(), nullable=False),
        sa.Column("is_notify_email", sa.Boolean(), nullable=False),
        sa.Column("is_notify_on_website", sa.Boolean(), nullable=False),
        sa.ForeignKeyConstraint(
            ["job_id"],
            ["saved_jobs.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("tasks")
    op.drop_table("job_listings")
    op.drop_table("documents")
    op.drop_table("contacts")
    op.drop_table("scraped_sites")
    op.drop_table("saved_jobs")
    with op.batch_alter_table("users", schema=None) as batch_op:
        batch_op.drop_index(batch_op.f("ix_users_username"))
        batch_op.drop_index(batch_op.f("ix_users_email"))

    op.drop_table("users")
    op.drop_table("scraped_site_settings")
    op.drop_table("notifications")
    op.drop_table("document_types")
    op.drop_table("application_stages")
    # ### end Alembic commands ###
