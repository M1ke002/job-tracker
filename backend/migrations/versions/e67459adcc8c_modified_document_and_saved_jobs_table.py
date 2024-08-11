"""modified document and saved_jobs table

Revision ID: e67459adcc8c
Revises: 2c9afc0dec8b
Create Date: 2024-08-10 16:09:17.013679

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "e67459adcc8c"
down_revision = "2c9afc0dec8b"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "saved_job_document",
        sa.Column("saved_job_id", sa.Integer(), nullable=False),
        sa.Column("document_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["document_id"],
            ["documents.id"],
        ),
        sa.ForeignKeyConstraint(
            ["saved_job_id"],
            ["saved_jobs.id"],
        ),
        sa.PrimaryKeyConstraint("saved_job_id", "document_id"),
    )
    with op.batch_alter_table("documents", schema=None) as batch_op:
        batch_op.drop_constraint("documents_job_id_fkey", type_="foreignkey")
        batch_op.drop_column("job_id")

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table("documents", schema=None) as batch_op:
        batch_op.add_column(sa.Column("job_id", sa.INTEGER(), autoincrement=False, nullable=True))
        batch_op.create_foreign_key("documents_job_id_fkey", "saved_jobs", ["job_id"], ["id"])

    op.drop_table("saved_job_document")
    # ### end Alembic commands ###