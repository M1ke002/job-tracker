"""empty message

Revision ID: af6cbe425800
Revises: d1198cb75421
Create Date: 2024-01-08 20:18:41.127297

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'af6cbe425800'
down_revision = 'd1198cb75421'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('scraped_site_settings',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('is_scrape_enabled', sa.Boolean(), nullable=False),
    sa.Column('scrape_frequency', sa.Integer(), nullable=False),
    sa.Column('is_notification_enabled', sa.Boolean(), nullable=False),
    sa.Column('is_notify_email', sa.Boolean(), nullable=False),
    sa.Column('is_notify_notification', sa.Boolean(), nullable=False),
    sa.Column('search_keyword', sa.String(length=150), nullable=True),
    sa.Column('location', sa.String(length=150), nullable=True),
    sa.Column('job_type', sa.String(length=150), nullable=True),
    sa.Column('work_type', sa.String(length=150), nullable=True),
    sa.Column('classification', sa.String(length=150), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('scraped_sites', schema=None) as batch_op:
        batch_op.add_column(sa.Column('scraped_site_settings_id', sa.Integer(), nullable=False))
        batch_op.create_foreign_key(None, 'scraped_site_settings', ['scraped_site_settings_id'], ['id'])
        batch_op.drop_column('is_notification_enabled')
        batch_op.drop_column('scrape_url')
        batch_op.drop_column('is_notify_notification')
        batch_op.drop_column('is_notify_email')
        batch_op.drop_column('scrape_frequency')
        batch_op.drop_column('is_scrape_enabled')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('scraped_sites', schema=None) as batch_op:
        batch_op.add_column(sa.Column('is_scrape_enabled', mysql.TINYINT(display_width=1), autoincrement=False, nullable=False))
        batch_op.add_column(sa.Column('scrape_frequency', mysql.INTEGER(), autoincrement=False, nullable=False))
        batch_op.add_column(sa.Column('is_notify_email', mysql.TINYINT(display_width=1), autoincrement=False, nullable=False))
        batch_op.add_column(sa.Column('is_notify_notification', mysql.TINYINT(display_width=1), autoincrement=False, nullable=False))
        batch_op.add_column(sa.Column('scrape_url', mysql.VARCHAR(length=1000), nullable=False))
        batch_op.add_column(sa.Column('is_notification_enabled', mysql.TINYINT(display_width=1), autoincrement=False, nullable=False))
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_column('scraped_site_settings_id')

    op.drop_table('scraped_site_settings')
    # ### end Alembic commands ###
