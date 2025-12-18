import requests
import json

# Test the comments API
base_url = "http://localhost:8000"

def test_comments_api():
    try:
        # Test basic connectivity
        response = requests.get(f"{base_url}/comments/test")
        print(f"Test endpoint: {response.status_code} - {response.json()}")
        
        # Test getting comments for post 1
        response = requests.get(f"{base_url}/comments/post/1")
        print(f"Get comments: {response.status_code}")
        if response.status_code == 200:
            print(f"Comments: {response.json()}")
        else:
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"Connection error: {e}")

if __name__ == "__main__":
    test_comments_api()