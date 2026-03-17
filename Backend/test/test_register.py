def test_register_success(client):
    payload = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "123456"
    }

    resp = client.post("/api/register", json=payload)

    assert resp.status_code == 201