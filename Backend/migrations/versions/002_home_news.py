"""home news content

Revision ID: 002_home_news
Revises: 001_recruit_todo
Create Date: 2026-07-15
"""
from alembic import op
import sqlalchemy as sa

revision = "002_home_news"
down_revision = "001_recruit_todo"
branch_labels = None
depends_on = None


def has_table(inspector, table_name):
    return table_name in inspector.get_table_names()


def upgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if not has_table(inspector, "home_news_item"):
        op.create_table(
            "home_news_item",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("theme", sa.String(length=20), nullable=False),
            sa.Column("title", sa.String(length=120), nullable=False),
            sa.Column("summary", sa.Text(), nullable=False),
            sa.Column("tag", sa.String(length=40), nullable=False),
            sa.Column("sort_order", sa.Integer(), server_default="0", nullable=False),
            sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=True),
            sa.Column("updated_at", sa.DateTime(), server_default=sa.func.now(), nullable=True),
            sa.CheckConstraint("theme IN ('cmen', 'eden')", name="ck_home_news_theme"),
        )


def downgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if has_table(inspector, "home_news_item"):
        op.drop_table("home_news_item")
