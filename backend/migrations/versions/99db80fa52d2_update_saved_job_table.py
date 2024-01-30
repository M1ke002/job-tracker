"""Update saved_job table

Revision ID: 99db80fa52d2
Revises: f9749a741cab
Create Date: 2024-01-30 11:32:50.789589

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '99db80fa52d2'
down_revision = 'f9749a741cab'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('saved_jobs', schema=None) as batch_op:
        batch_op.add_column(sa.Column('rejected_at_stage_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key(None, 'application_stages', ['rejected_at_stage_id'], ['id'])
        batch_op.drop_column('status')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('saved_jobs', schema=None) as batch_op:
        batch_op.add_column(sa.Column('status', mysql.VARCHAR(length=100), nullable=False))
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_column('rejected_at_stage_id')

    # ### end Alembic commands ###
