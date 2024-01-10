"""Update scrape settings table

Revision ID: c6c4d014d6be
Revises: af6cbe425800
Create Date: 2024-01-08 21:09:39.848002

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'c6c4d014d6be'
down_revision = 'af6cbe425800'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('scraped_site_settings', schema=None) as batch_op:
        batch_op.add_column(sa.Column('max_pages_to_scrape', sa.Integer(), nullable=False))

    with op.batch_alter_table('scraped_sites', schema=None) as batch_op:
        batch_op.alter_column('last_scrape_date',
               existing_type=mysql.DATETIME(),
               nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('scraped_sites', schema=None) as batch_op:
        batch_op.alter_column('last_scrape_date',
               existing_type=mysql.DATETIME(),
               nullable=False)

    with op.batch_alter_table('scraped_site_settings', schema=None) as batch_op:
        batch_op.drop_column('max_pages_to_scrape')

    # ### end Alembic commands ###