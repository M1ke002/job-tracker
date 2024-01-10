"""Changes to job_listing attrs

Revision ID: fbdc796ae147
Revises: c6c4d014d6be
Create Date: 2024-01-09 11:52:14.071342

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'fbdc796ae147'
down_revision = 'c6c4d014d6be'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('job_listings', schema=None) as batch_op:
        batch_op.add_column(sa.Column('job_date', sa.String(length=100), nullable=True))
        batch_op.drop_column('job_type')
        batch_op.drop_column('posted_date')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('job_listings', schema=None) as batch_op:
        batch_op.add_column(sa.Column('posted_date', mysql.VARCHAR(length=100), nullable=True))
        batch_op.add_column(sa.Column('job_type', mysql.VARCHAR(length=100), nullable=True))
        batch_op.drop_column('job_date')

    # ### end Alembic commands ###