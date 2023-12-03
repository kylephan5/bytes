import os
from PIL import Image
import numpy as np
import hashlib

# Directory to store uploaded images
UPLOAD_DIR = 'uploaded_images'


def calculate_hash(file_contents):
    ''' hash image contents to prevent duplicate uploads'''
    sha256_hash = hashlib.sha256()
    sha256_hash.update(file_contents)
    return sha256_hash.hexdigest()


def process_images(image_files):
    results = []
    image_paths = []

    # make upload directory if it doesn't exist
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    try:
        # at least one image to be able to process
        if not image_files:
            raise ValueError("No image provided")

        uploaded_hashes = set()

        for index, image_file in enumerate(image_files):
            file_contents = image_file.read()
            file_hash = calculate_hash(file_contents)

            # Check if the same image has already been uploaded
            if file_hash in uploaded_hashes:
                continue

            uploaded_hashes.add(file_hash)

            # make unique filename for each image
            unique_filename = f"{file_hash}.jpg"
            image_path = os.path.join(UPLOAD_DIR, unique_filename)
            image_paths.append(image_path)

            with open(image_path, 'wb') as f:
                f.write(file_contents)

            image = Image.open(image_path)
            image = image.resize((299, 299))
            image = np.array(image) / 255.0  # Normalize?

            # TODO: image processing logic
            analysis_result = perform_analysis(image)
            results.append(f'{analysis_result}: {index}')

    except Exception as e:
        results.append(f"Error processing images: {str(e)}")

    # delete images
    finally:
        for image_path in image_paths:
            if os.path.exists(image_path):
                os.remove(image_path)

    return results


def perform_analysis(image):
    # TODO: KYLE CV
    return "Placeholder Analysis Result"
