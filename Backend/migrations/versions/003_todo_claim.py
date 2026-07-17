"""todo claim owner

Revision ID: 003_todo_claim
Revises: 002_home_news
Create Date: 2026-07-18
"""
from alembic import op
import sqlalchemy as sa

revision = "003_todo_claim"
down_revision = "002_home_news"
branch_labels = None
depends_on = None


def has_table(inspector, table_name):
    return table_name in inspector.get_table_names()


def has_column(inspector, table_name, column_name):
    if not has_table(inspector, table_name):
        return False
    return column_name in [column["name"] for column in inspector.get_columns(table_name)]


def upgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if not has_column(inspector, "todo", "claimed_by_id"):
        op.add_column("todo", sa.Column("claimed_by_id", sa.Integer(), nullable=True))
        op.create_foreign_key("fk_todo_claimed_by_id_user", "todo", "user", ["claimed_by_id"], ["id"])


def downgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if has_column(inspector, "todo", "claimed_by_id"):
        op.drop_constraint("fk_todo_claimed_by_id_user", "todo", type_="foreignkey")
        op.drop_column("todo", "claimed_by_id")
