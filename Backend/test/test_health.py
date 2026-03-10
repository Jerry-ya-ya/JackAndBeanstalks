def test_health_ok(client):
    resp = client.get("/api/healthz")
    assert resp.status_code == 200