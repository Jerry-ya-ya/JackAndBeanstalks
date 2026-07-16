from datetime import datetime, timedelta, timezone

TAIPEI_TZ = timezone(timedelta(hours=8))


def taipei_now():
    return datetime.now(TAIPEI_TZ).replace(tzinfo=None)


def to_taipei_iso(value):
    if not value:
        return None

    if value.tzinfo is None:
        return value.replace(tzinfo=TAIPEI_TZ).isoformat()

    return value.astimezone(TAIPEI_TZ).isoformat()


def to_taipei_text(value, fmt='%Y-%m-%d %H:%M'):
    if not value:
        return None

    if value.tzinfo is None:
        return value.strftime(fmt)

    return value.astimezone(TAIPEI_TZ).strftime(fmt)
