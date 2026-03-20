def test_register_success(client):
    payload = {
        "username": "testregisteruser",
        "email": "testregisteruser@example.com",
        "password": "123456"
    }

    resp = client.post("/api/register", json=payload)

    assert resp.status_code == 201