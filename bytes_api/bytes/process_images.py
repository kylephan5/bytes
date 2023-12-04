import os
from PIL import Image
import numpy as np
import hashlib
import torch
import transforms as T
import csv
import torchvision
from torchvision.models.detection.faster_rcnn import FastRCNNPredictor


def get_classes():
    classes = []
    with open('./oidv7-class-descriptions-boxable-modified.csv') as classes_file:
        reader_obj = csv.reader(classes_file)
        for index, line in enumerate(reader_obj):
            if index == 0:
                continue

            classes.append(line[1])

    return classes


def get_model(num_classes):
  weights = torchvision.models.detection.FasterRCNN_ResNet50_FPN_V2_Weights.DEFAULT
  model = torchvision.models.detection.fasterrcnn_resnet50_fpn_v2(weights=weights)

  in_features = model.roi_heads.box_predictor.cls_score.in_features

  model.roi_heads.box_predictor = FastRCNNPredictor(in_features, num_classes)
  return model


# Directory to store uploaded images


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

            # TODO: image processing logic
            analysis_result = perform_analysis(image) # analysis_result is a list of all things
            results.extend(analysis_result)

    except Exception as e:
        results.append(f"Error processing images: {str(e)}")

    # delete images
    finally:
        for image_path in image_paths:
            if os.path.exists(image_path):
                os.remove(image_path)

    return list(set(results))


def perform_analysis(image):
    # TODO: KYLE CV
    np_sample_image = np.array(image.convert("RGB"))

    transformed_img = torchvision.transforms.transforms.ToTensor()(
        torchvision.transforms.ToPILImage()(np_sample_image))

    pred = model([transformed_img])
    pred_labels = [idx_to_class[i - 1] for i in pred[0]['labels'].numpy()]
    pred_score = list(pred[0]['scores'].detach().numpy())

    pred_t = [pred_score.index(x) for x in pred_score if x > confidence]

    return [pred_labels[ind] for ind in pred_t]


confidence = 0.7
UPLOAD_DIR = 'uploaded_images'
path = './model.pth'
classes = get_classes()
idx_to_class = {i: j for i, j in enumerate(classes)}
model = get_model(len(classes)+2)
model.load_state_dict(torch.load(path, map_location=torch.device('cpu')))
model.eval()