# # import tensorflow as tf
# import numpy as np
# from PIL import Image
# import io

# model = tf.keras.applications.InceptionV3(weights='imagenet')


def process_images(image_files):
    results = []

    for image_file in image_files:
        print(image_file)
#         try:
#             image = Image.open(image_file)
#             image = image.resize((299, 299))
#             image = np.array(image) / 255.0  # Normalize

#             # InceptionV3 model
#             # predictions = model.predict(np.expand_dims(image, axis=0))
#             decoded_predictions = tf.keras.applications.inception_v3.decode_predictions(
#                 predictions)

#             top_prediction = decoded_predictions[0][0]
#             food_item_name = top_prediction[1]

#             results.append(f"Detected food item!: {food_item_name}")

#         except Exception as e:
#             results.append(f"Error processing image??: {str(e)}")

#     return results
