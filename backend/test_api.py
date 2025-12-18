import requests

# Test login first
login_data = {
    "email": "admin@blog.com",
    "password": "admin123"
}

response = requests.post("http://localhost:8000/auth/login", json=login_data)
print("Login:", response.status_code, response.json())

if response.status_code == 200:
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test protected endpoints
    endpoints = [
        "/posts/my-posts",
        "/posts/all-posts", 
        "/users/",
        "/comments/pending"
    ]
    
    for endpoint in endpoints:
        resp = requests.get(f"http://localhost:8000{endpoint}", headers=headers)
        print(f"{endpoint}: {resp.status_code}")
        if resp.status_code != 200:
            print(f"  Error: {resp.text}")