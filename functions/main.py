import functions_framework
import pickle
import json
from google.cloud import storage
import numpy as np

model = None

@functions_framework.http
def load_model_from_gcs(bucket_name, file_name):
    """
    Load the pickled model from a Google Cloud Storage bucket.
    """
    client = storage.Client()
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(file_name)

    model_data = blob.download_as_bytes()

    loaded_model = pickle.loads(model_data)
    return loaded_model

def main(request):
    """
    Google Cloud Function to predict the class of a new sample.

    Request should be a JSON object with the following format:
    {
        "features": [value1, value2, value3, value4]
    }
    """
    global model


    if model is None:
        bucket_name = "tb-model-bucket" 
        file_name = "model.pkl" 
        model = load_model_from_gcs(bucket_name, file_name)

    try:
        request_json = request.get_json()
        features = request_json.get("features")

        if not features or len(features) != 4:
            return (
                json.dumps({"error": "Invalid input. Provide exactly 6 features."}),
                400,
            )

        features_array = np.array(features).reshape(1, -1)

        prediction = model.predict(features_array)

        return json.dumps({"prediction": int(prediction[0])}), 200

    except Exception as e:
        return json.dumps({"error": str(e)}), 500