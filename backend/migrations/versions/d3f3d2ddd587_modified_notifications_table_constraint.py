"""modified notifications table constraint

Revision ID: d3f3d2ddd587
Revises: 75a6a8e4310f
Create Date: 2024-02-03 09:31:58.939090

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'd3f3d2ddd587'
down_revision = '75a6a8e4310f'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('notifications', schema=None) as batch_op:
        batch_op.alter_column('scraped_site_id',
               existing_type=mysql.INTEGER(),
               nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('notifications', schema=None) as batch_op:
        batch_op.alter_column('scraped_site_id',
               existing_type=mysql.INTEGER(),
               nullable=False)

    # ### end Alembic commands ###