"""member github url

Revision ID: 005_member_github_url
Revises: 004_member_content
Create Date: 2026-07-23
"""
from alembic import op
import sqlalchemy as sa

revision = "005_member_github_url"
down_revision = "004_member_content"
branch_labels = None
depends_on = None


def has_table(inspector, table_name):
    return table_name in inspector.get_table_names()


def has_column(inspector, table_name, column_name):
    return column_name in {column["name"] for column in inspector.get_columns(table_name)}


def upgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if not has_table(inspector, "member_content_item"):
        return

    has_github_url = has_column(inspector, "member_content_item", "github_url")
    has_github_username = has_column(inspector, "member_content_item", "github_username")

    if not has_github_url:
        op.add_column(
            "member_content_item",
            sa.Column("github_url", sa.String(length=255), nullable=True),
        )

    if has_github_username:
        op.execute(
            """
            UPDATE member_content_item
            SET github_url = CASE
                WHEN github_username LIKE 'http://%' THEN regexp_replace(github_username, '^http://', 'https://')
                WHEN github_username LIKE 'https://%' THEN github_username
                WHEN github_username LIKE 'github.com/%' THEN 'https://' || github_username
                ELSE 'https://github.com/' || regexp_replace(github_username, '^@', '')
            END
            WHERE github_url IS NULL OR github_url = ''
            """
        )
    else:
        op.execute(
            """
            UPDATE member_content_item
            SET github_url = 'https://github.com/Jerry-ya-ya'
            WHERE github_url IS NULL OR github_url = ''
            """
        )

    op.alter_column("member_content_item", "github_url", nullable=False)

    if has_github_username:
        op.drop_column("member_content_item", "github_username")


def downgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if not has_table(inspector, "member_content_item"):
        return

    has_github_url = has_column(inspector, "member_content_item", "github_url")
    has_github_username = has_column(inspector, "member_content_item", "github_username")

    if not has_github_username:
        op.add_column(
            "member_content_item",
            sa.Column("github_username", sa.String(length=80), nullable=True),
        )

    if has_github_url:
        op.execute(
            """
            UPDATE member_content_item
            SET github_username = regexp_replace(github_url, '^https?://github.com/', '')
            WHERE github_username IS NULL OR github_username = ''
            """
        )

    op.alter_column("member_content_item", "github_username", nullable=False)

    if has_github_url:
        op.drop_column("member_content_item", "github_url")
