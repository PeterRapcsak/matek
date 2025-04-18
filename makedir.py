import os
import requests

# Read the links from links.txt
with open("links.txt", "r", encoding="utf-8") as f:
    links = [line.strip() for line in f if line.strip()]

# Process each link
for url in links:
    try:
        filename = os.path.basename(url)
        parts = filename.split("_")
        
        # Extract year and set number
        year = parts[4]
        set_number = parts[5]
        question_id = parts[6]

        folder_name = f"{year}_{set_number}"
        is_solution = question_id.endswith("j")

        # Choose subfolder based on whether it's a solution
        subfolder = "solutions" if is_solution else "questions"
        save_dir = os.path.join(folder_name, subfolder)
        os.makedirs(save_dir, exist_ok=True)

        save_path = os.path.join(save_dir, filename)

        # Check if the file already exists
        if os.path.exists(save_path):
            print(f"⚠️ Skipped (already exists): {save_path}")
            continue

        # Download the image
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            with open(save_path, "wb") as file:
                file.write(response.content)
            print(f"✅ Downloaded: {save_path}")
        else:
            print(f"❌ Failed to download (Status {response.status_code}): {url}")

    except Exception as e:
        print(f"⚠️ Error processing {url}: {e}")
