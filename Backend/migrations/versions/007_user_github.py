"""user github url

Revision ID: 007_user_github
Revises: 006_member_roles
Create Date: 2026-07-23
"""
from alembic import op
import sqlalchemy as sa


revision = "007_user_github"
down_revision = "006_member_roles"
branch_labels = None
depends_on = None


def has_table(inspector, table_name):
    return table_name in inspector.get_table_names()


def has_column(inspector, table_name, column_name):
    return any(column["name"] == column_name for column in inspector.get_columns(table_name))


def upgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if has_table(inspector, "user") and not has_column(inspector, "user", "github_url"):
        op.add_column("user", sa.Column("github_url", sa.String(length=255), nullable=True))


def downgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if has_table(inspector, "user") and has_column(inspector, "user", "github_url"):
        op.drop_column("user", "github_url")
