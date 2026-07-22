"""member content

Revision ID: 004_member_content
Revises: 003_todo_claim
Create Date: 2026-07-22
"""
from alembic import op
import sqlalchemy as sa

revision = "004_member_content"
down_revision = "003_todo_claim"
branch_labels = None
depends_on = None


def has_table(inspector, table_name):
    return table_name in inspector.get_table_names()


def upgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if not has_table(inspector, "member_content_item"):
        op.create_table(
            "member_content_item",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("name", sa.String(length=80), nullable=False),
            sa.Column("role", sa.String(length=120), nullable=False),
            sa.Column("github_url", sa.String(length=255), nullable=False),
            sa.Column("sort_order", sa.Integer(), server_default="0", nullable=False),
            sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=True),
            sa.Column("updated_at", sa.DateTime(), server_default=sa.func.now(), nullable=True),
        )


def downgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if has_table(inspector, "member_content_item"):
        op.drop_table("member_content_item")
