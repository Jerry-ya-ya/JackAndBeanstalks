"""project recruitment and todo priority

Revision ID: 001_recruit_todo
Revises: None
Create Date: 2026-07-13
"""
from alembic import op
import sqlalchemy as sa


revision = "001_recruit_todo"
down_revision = None
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

    if not has_table(inspector, "project_recruitment"):
        op.create_table(
            "project_recruitment",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("title", sa.String(length=120), nullable=False),
            sa.Column("summary", sa.Text(), nullable=False),
            sa.Column("role_needed", sa.String(length=120), nullable=True),
            sa.Column("contact", sa.String(length=160), nullable=True),
            sa.Column("max_members", sa.Integer(), nullable=True),
            sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=True),
            sa.Column("creator_id", sa.Integer(), sa.ForeignKey("user.id"), nullable=False),
        )

    if not has_table(inspector, "project_recruitment_member"):
        op.create_table(
            "project_recruitment_member",
            sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("message", sa.Text(), nullable=True),
            sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=True),
            sa.Column("project_id", sa.Integer(), sa.ForeignKey("project_recruitment.id"), nullable=False),
            sa.Column("user_id", sa.Integer(), sa.ForeignKey("user.id"), nullable=False),
            sa.UniqueConstraint("project_id", "user_id", name="uq_project_recruitment_member"),
        )

    if not has_column(inspector, "todo", "created_by_id"):
        op.add_column("todo", sa.Column("created_by_id", sa.Integer(), nullable=True))
        op.create_foreign_key("fk_todo_created_by_id_user", "todo", "user", ["created_by_id"], ["id"])

    if not has_column(inspector, "todo", "project_id"):
        op.add_column("todo", sa.Column("project_id", sa.Integer(), nullable=True))
        op.create_foreign_key(
            "fk_todo_project_id_project_recruitment",
            "todo",
            "project_recruitment",
            ["project_id"],
            ["id"],
        )

    if not has_column(inspector, "todo", "created_at"):
        op.add_column("todo", sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=True))

    if not has_column(inspector, "todo", "priority"):
        op.add_column("todo", sa.Column("priority", sa.Integer(), server_default="5", nullable=False))

    op.execute("UPDATE todo SET priority = 5 WHERE priority IS NULL")

    if bind.dialect.name == "postgresql":
        op.execute(
            """
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_constraint WHERE conname = 'ck_todo_priority_0_9'
                ) THEN
                    ALTER TABLE todo
                    ADD CONSTRAINT ck_todo_priority_0_9
                    CHECK (priority BETWEEN 0 AND 9);
                END IF;
            END $$;
            """
        )


def downgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if bind.dialect.name == "postgresql":
        op.execute("ALTER TABLE todo DROP CONSTRAINT IF EXISTS ck_todo_priority_0_9")

    if has_column(inspector, "todo", "priority"):
        op.drop_column("todo", "priority")
    if has_column(inspector, "todo", "created_at"):
        op.drop_column("todo", "created_at")
    if has_column(inspector, "todo", "project_id"):
        op.drop_constraint("fk_todo_project_id_project_recruitment", "todo", type_="foreignkey")
        op.drop_column("todo", "project_id")
    if has_column(inspector, "todo", "created_by_id"):
        op.drop_constraint("fk_todo_created_by_id_user", "todo", type_="foreignkey")
        op.drop_column("todo", "created_by_id")

    if has_table(inspector, "project_recruitment_member"):
        op.drop_table("project_recruitment_member")
    if has_table(inspector, "project_recruitment"):
        op.drop_table("project_recruitment")
