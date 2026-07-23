"""member fixed roles

Revision ID: 006_member_roles
Revises: 005_member_github_url
Create Date: 2026-07-23
"""
from alembic import op
import sqlalchemy as sa

revision = "006_member_roles"
down_revision = "005_member_github_url"
branch_labels = None
depends_on = None


def has_table(inspector, table_name):
    return table_name in inspector.get_table_names()


def has_check(inspector, table_name, constraint_name):
    return constraint_name in {
        constraint["name"]
        for constraint in inspector.get_check_constraints(table_name)
    }


def upgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if not has_table(inspector, "member_content_item"):
        return

    op.execute(
        """
        UPDATE member_content_item
        SET role = 'member'
        WHERE role NOT IN ('superadmin', 'admin', 'member', 'user')
        """
    )

    if not has_check(inspector, "member_content_item", "ck_member_content_role"):
        op.create_check_constraint(
            "ck_member_content_role",
            "member_content_item",
            "role IN ('superadmin', 'admin', 'member', 'user')",
        )

    op.alter_column(
        "member_content_item",
        "role",
        existing_type=sa.String(length=120),
        type_=sa.String(length=20),
        existing_nullable=False,
    )


def downgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if not has_table(inspector, "member_content_item"):
        return

    if has_check(inspector, "member_content_item", "ck_member_content_role"):
        op.drop_constraint(
            "ck_member_content_role",
            "member_content_item",
            type_="check",
        )

    op.alter_column(
        "member_content_item",
        "role",
        existing_type=sa.String(length=20),
        type_=sa.String(length=120),
        existing_nullable=False,
    )
